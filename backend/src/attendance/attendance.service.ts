import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ClassesService } from '../classes/classes.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly db: DatabaseService,
    private readonly classesService: ClassesService,
  ) {}

  private parseId(id: string, label = 'Chamada'): number {
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new NotFoundException(`${label} com ID ${id} não encontrada`);
    }
    return parsed;
  }

  async create(createAttendanceDto: CreateAttendanceDto) {
    const turma = await this.classesService.findOne(
      createAttendanceDto.classId,
    );
    const turmaId = Number(turma.id);
    const horario = turma.schedule || '14h';

    // Impede chamada duplicada para a mesma turma na mesma data
    const duplicateCheck = await this.db.query(
      `SELECT id FROM aulas WHERE turma_id = $1 AND data = $2`,
      [turmaId, createAttendanceDto.date],
    );
    if ((duplicateCheck.rowCount ?? 0) > 0) {
      throw new BadRequestException(
        `Já existe uma chamada registrada para ${turma.name} na data ${createAttendanceDto.date}`,
      );
    }

    const client = await this.db.getPool().connect();
    try {
      await client.query('BEGIN');

      const aulaRes = await client.query(
        `INSERT INTO aulas (turma_id, data, horario)
         VALUES ($1, $2, $3)
         RETURNING id, turma_id, TO_CHAR(data, 'YYYY-MM-DD') AS data`,
        [turmaId, createAttendanceDto.date, horario],
      );
      const aula = aulaRes.rows[0];

      const processedRecords: {
  studentId: string;
  studentName: string;
  present: boolean;
}[] = [];
      for (const record of createAttendanceDto.records) {
        const alunoId = this.parseId(record.studentId, 'Aluno');

        const alunoRes = await client.query(
          `SELECT id, nome FROM alunos WHERE id = $1`,
          [alunoId],
        );
        if (alunoRes.rowCount === 0) {
          throw new NotFoundException(
            `Aluno com ID ${record.studentId} não encontrado`,
          );
        }

        await client.query(
          `INSERT INTO frequencias (aula_id, aluno_id, presente)
           VALUES ($1, $2, $3)`,
          [aula.id, alunoId, record.present],
        );

        processedRecords.push({
          studentId: String(alunoId),
          studentName: alunoRes.rows[0].nome,
          present: record.present,
        });
      }

      await client.query('COMMIT');

      return {
        id: String(aula.id),
        classId: String(aula.turma_id),
        date: aula.data,
        records: processedRecords,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Erro ao registrar chamada: ${(error as Error).message}`,
      );
    } finally {
      client.release();
    }
  }

  async findAll(classId?: string) {
    const params: any[] = [];
    let whereClause = '';

    if (classId) {
      const numericClassId = this.parseId(classId, 'Turma');
      params.push(numericClassId);
      whereClause = `WHERE au.turma_id = $1`;
    }

    const result = await this.db.query(
      `SELECT
         au.id AS aula_id,
         au.turma_id,
         TO_CHAR(au.data, 'YYYY-MM-DD') AS data,
         f.aluno_id,
         al.nome AS aluno_nome,
         f.presente
       FROM aulas au
       LEFT JOIN frequencias f ON f.aula_id = au.id
       LEFT JOIN alunos al ON al.id = f.aluno_id
       ${whereClause}
       ORDER BY au.data DESC, au.id DESC, al.nome ASC`,
      params,
    );

    const grouped = new Map<string, any>();

    for (const row of result.rows) {
      const key = String(row.aula_id);
      if (!grouped.has(key)) {
        grouped.set(key, {
          id: key,
          classId: String(row.turma_id),
          date: row.data,
          records: [],
        });
      }

      if (row.aluno_id !== null) {
        grouped.get(key).records.push({
          studentId: String(row.aluno_id),
          studentName: row.aluno_nome,
          present: row.presente,
        });
      }
    }

    return Array.from(grouped.values());
  }

  async findOne(id: string) {
    const numericId = this.parseId(id);
    const result = await this.db.query(
      `SELECT
         au.id AS aula_id,
         au.turma_id,
         TO_CHAR(au.data, 'YYYY-MM-DD') AS data,
         f.aluno_id,
         al.nome AS aluno_nome,
         f.presente
       FROM aulas au
       LEFT JOIN frequencias f ON f.aula_id = au.id
       LEFT JOIN alunos al ON al.id = f.aluno_id
       WHERE au.id = $1
       ORDER BY al.nome ASC`,
      [numericId],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`Chamada com ID ${id} não encontrada`);
    }

    const first = result.rows[0];
    const records = result.rows
      .filter((r) => r.aluno_id !== null)
      .map((r) => ({
        studentId: String(r.aluno_id),
        studentName: r.aluno_nome,
        present: r.presente,
      }));

    return {
      id: String(first.aula_id),
      classId: String(first.turma_id),
      date: first.data,
      records,
    };
  }

  async remove(id: string) {
    const numericId = this.parseId(id);
    const existing = await this.findOne(id);

    await this.db.query(`DELETE FROM aulas WHERE id = $1`, [numericId]);

    return { deleted: true, attendance: existing };
  }
}