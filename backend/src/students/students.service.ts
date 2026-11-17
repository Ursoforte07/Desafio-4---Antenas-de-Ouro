import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly db: DatabaseService) {}

  private parseId(id: string, label = 'Aluno'): number {
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new NotFoundException(`${label} com ID ${id} não encontrado`);
    }
    return parsed;
  }

  async create(createStudentDto: CreateStudentDto) {
    const nome = createStudentDto.name.trim().toUpperCase();
    const turmaId = this.parseId(createStudentDto.classId, 'Turma');

    // Verifica se a turma existe
    const turmaCheck = await this.db.query(
      `SELECT id FROM turmas WHERE id = $1`,
      [turmaId],
    );
    if (turmaCheck.rowCount === 0) {
      throw new NotFoundException(
        `Turma com ID ${createStudentDto.classId} não encontrada`,
      );
    }

    const client = await this.db.getPool().connect();
    try {
      await client.query('BEGIN');

      const alunoRes = await client.query(
        `INSERT INTO alunos (nome) VALUES ($1) RETURNING id, nome`,
        [nome],
      );
      const aluno = alunoRes.rows[0];

      await client.query(
        `INSERT INTO matriculas (aluno_id, turma_id) VALUES ($1, $2)`,
        [aluno.id, turmaId],
      );

      await client.query('COMMIT');
      return this.findOne(String(aluno.id));
    } catch (error) {
      await client.query('ROLLBACK');
      throw new BadRequestException(`Erro ao cadastrar aluno: ${(error as Error).message}`);
    } finally {
      client.release();
    }
  }

  async findAll(
    search?: string,
    sortBy?: 'status' | 'class',
    order: 'asc' | 'desc' = 'asc',
    classId?: string,
  ) {
    const conditions: string[] = [];
    const params: any[] = [];

    if (classId) {
      const numericClassId = this.parseId(classId, 'Turma');
      params.push(numericClassId);
      conditions.push(`turma_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search.trim().toLowerCase()}%`);
      conditions.push(`LOWER(nome) LIKE $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const direction = order === 'desc' ? 'DESC' : 'ASC';
    let orderByClause = 'ORDER BY aluno_id ASC';

    if (sortBy === 'status') {
      orderByClause = `ORDER BY COALESCE(presenca, 100) ${direction}, aluno_id ASC`;
    } else if (sortBy === 'class') {
      orderByClause = `ORDER BY turma_id ${direction}, aluno_id ASC`;
    }

    const result = await this.db.query(
      `SELECT
         aluno_id,
         nome,
         turma_id,
         aulas_presentes,
         total_aulas,
         COALESCE(presenca, 100) AS presenca,
         status_color
       FROM vw_linhas_alunos
       ${whereClause}
       ${orderByClause}`,
      params,
    );

    return result.rows.map((row) => ({
      id: String(row.aluno_id),
      name: row.nome,
      classId: String(row.turma_id),
      presentLessons: Number(row.aulas_presentes),
      totalLessons: Number(row.total_aulas),
      attendancePercentage: Number(row.presenca),
      statusColor: row.status_color as 'RED' | 'YELLOW' | 'GREEN',
    }));
  }

  async findOne(id: string) {
    const numericId = this.parseId(id);
    const result = await this.db.query(
      `SELECT
         aluno_id,
         nome,
         turma_id,
         aulas_presentes,
         aulas_faltas,
         total_aulas,
         COALESCE(presenca, 100) AS presenca,
         status_color
       FROM vw_linhas_alunos
       WHERE aluno_id = $1
       LIMIT 1`,
      [numericId],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
    }

    const row = result.rows[0];
    return {
      id: String(row.aluno_id),
      name: row.nome,
      classId: String(row.turma_id),
      presentLessons: Number(row.aulas_presentes),
      absentLessons: Number(row.aulas_faltas),
      totalLessons: Number(row.total_aulas),
      attendancePercentage: Number(row.presenca),
      statusColor: row.status_color as 'RED' | 'YELLOW' | 'GREEN',
    };
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const numericId = this.parseId(id);
    await this.findOne(id);

    const client = await this.db.getPool().connect();
    try {
      await client.query('BEGIN');

      if (updateStudentDto.name) {
        const nome = updateStudentDto.name.trim().toUpperCase();
        await client.query(`UPDATE alunos SET nome = $1 WHERE id = $2`, [
          nome,
          numericId,
        ]);
      }

      if (updateStudentDto.classId) {
        const novaTurmaId = this.parseId(updateStudentDto.classId, 'Turma');
        const turmaCheck = await client.query(
          `SELECT id FROM turmas WHERE id = $1`,
          [novaTurmaId],
        );
        if (turmaCheck.rowCount === 0) {
          throw new NotFoundException(
            `Turma com ID ${updateStudentDto.classId} não encontrada`,
          );
        }

        await client.query(
          `UPDATE matriculas SET turma_id = $1 WHERE aluno_id = $2`,
          [novaTurmaId, numericId],
        );
      }

      await client.query('COMMIT');
      return this.findOne(id);
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(`Erro ao atualizar aluno: ${(error as Error).message}`);
    } finally {
      client.release();
    }
  }

  async remove(id: string) {
    const numericId = this.parseId(id);
    const existing = await this.findOne(id);

    await this.db.query(`DELETE FROM alunos WHERE id = $1`, [numericId]);

    return { deleted: true, student: existing };
  }
}