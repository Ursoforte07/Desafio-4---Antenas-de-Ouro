import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly db: DatabaseService) {}

  private parseId(id: string): number {
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new NotFoundException(`Turma com ID ${id} não encontrada`);
    }
    return parsed;
  }

  async create(createClassDto: CreateClassDto) {
    const nome = createClassDto.name.trim().toUpperCase();
    // Gera um código único padrão caso não seja enviado pelo frontend atual
    const codigo = `TURMA-${Date.now()}`;
    const horario = 'A definir';

    const result = await this.db.query(
      `INSERT INTO turmas (nome, codigo, horario, professor_id)
       VALUES ($1, $2, $3, 1)
       RETURNING id, nome, codigo, horario`,
      [nome, codigo, horario],
    );

    const row = result.rows[0];
    return {
      id: String(row.id),
      name: row.nome,
      code: row.codigo,
      schedule: row.horario,
    };
  }

  async findAll() {
    const result = await this.db.query(
      `SELECT
         id,
         nome,
         codigo,
         horario,
         total_alunos,
         aulas_cadastradas,
         alunos_baixa_frequencia,
         presenca,
         faltosos_percentual
       FROM vw_resumo_turmas
       ORDER BY id ASC`,
    );

    return result.rows.map((row) => ({
      id: String(row.id),
      name: row.nome,
      code: row.codigo,
      schedule: row.horario,
      totalStudents: Number(row.total_alunos),
      totalLessons: Number(row.aulas_cadastradas),
      lowFrequencyCount: Number(row.alunos_baixa_frequencia),
      presentPercentage: Number(row.presenca),
      absentPercentage: Number(row.faltosos_percentual),
    }));
  }

  async getDashboard() {
    const [dashboardRes, colorsRes] = await Promise.all([
      this.db.query(
        `SELECT
           total_turmas,
           total_alunos,
           aulas_cadastradas,
           presenca_media,
           alunos_baixa_frequencia
         FROM vw_dashboard`,
      ),
      this.db.query(
        `SELECT
           COUNT(*) FILTER (WHERE status_color = 'YELLOW')::INTEGER AS warning_students,
           COUNT(*) FILTER (WHERE status_color = 'GREEN')::INTEGER AS healthy_students
         FROM vw_linhas_alunos`,
      ),
    ]);

    const dash = dashboardRes.rows[0];
    const colors = colorsRes.rows[0];
    const overallPresentPercentage = Number(dash.presenca_media ?? 100);

    return {
      totalClasses: Number(dash.total_turmas),
      totalStudents: Number(dash.total_alunos),
      lowFrequencyStudents: Number(dash.alunos_baixa_frequencia),
      warningStudents: Number(colors?.warning_students ?? 0),
      healthyStudents: Number(colors?.healthy_students ?? 0),
      overallPresentPercentage,
      overallAbsentPercentage: 100 - overallPresentPercentage,
    };
  }

  async findOne(id: string) {
    const numericId = this.parseId(id);
    const result = await this.db.query(
      `SELECT id, nome, codigo, horario
       FROM turmas
       WHERE id = $1`,
      [numericId],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`Turma com ID ${id} não encontrada`);
    }

    const row = result.rows[0];
    return {
      id: String(row.id),
      name: row.nome,
      code: row.codigo,
      schedule: row.horario,
    };
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    const numericId = this.parseId(id);
    await this.findOne(id);

    if (updateClassDto.name) {
      const nome = updateClassDto.name.trim().toUpperCase();
      await this.db.query(`UPDATE turmas SET nome = $1 WHERE id = $2`, [
        nome,
        numericId,
      ]);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const numericId = this.parseId(id);
    const existing = await this.findOne(id);

    try {
      await this.db.query(`DELETE FROM turmas WHERE id = $1`, [numericId]);
    } catch (error) {
      throw new BadRequestException(
        `Não foi possível remover a turma com ID ${id}: ${(error as Error).message}`,
      );
    }

    return { deleted: true, class: existing };
  }
}