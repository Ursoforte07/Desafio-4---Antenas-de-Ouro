import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassEntity } from './entities/class.entity';
import { StudentsService } from '../students/students.service';

@Injectable()
export class ClassesService {
  constructor(private readonly studentsService: StudentsService) {}

  private classes: ClassEntity[] = [
    { id: '1', name: 'TURMA 1' },
    { id: '2', name: 'TURMA 2' },
  ];

  create(createClassDto: CreateClassDto) {
    const newClass: ClassEntity = {
      id: String(Date.now()),
      name: createClassDto.name.toUpperCase(),
    };
    this.classes.push(newClass);
    return newClass;
  }

  findAll() {
    const allStudents = this.studentsService.findAll();

    return this.classes.map((turma) => {
      const classStudents = allStudents.filter((s) => s.classId === turma.id);
      const totalStudents = classStudents.length;
      const totalLessons =
        totalStudents > 0 ? Math.max(...classStudents.map((s) => s.totalLessons)) : 0;
      const lowFrequencyCount = classStudents.filter((s) => s.statusColor === 'RED').length;
      const presentPercentage =
        totalStudents > 0
          ? Math.round(
              classStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / totalStudents,
            )
          : 100;

      return {
        id: turma.id,
        name: turma.name,
        totalStudents,
        totalLessons,
        lowFrequencyCount,
        presentPercentage,
        absentPercentage: 100 - presentPercentage,
      };
    });
  }

  getDashboard() {
    const classesStats = this.findAll();
    const allStudents = this.studentsService.findAll();

    const totalClasses = classesStats.length;
    const totalStudents = allStudents.length;
    const lowFrequencyStudents = allStudents.filter((s) => s.statusColor === 'RED').length;
    const warningStudents = allStudents.filter((s) => s.statusColor === 'YELLOW').length;
    const healthyStudents = allStudents.filter((s) => s.statusColor === 'GREEN').length;

    const overallPresentPercentage =
      totalStudents > 0
        ? Math.round(allStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / totalStudents)
        : 100;

    return {
      totalClasses,
      totalStudents,
      lowFrequencyStudents,
      warningStudents,
      healthyStudents,
      overallPresentPercentage,
      overallAbsentPercentage: 100 - overallPresentPercentage,
    };
  }

  findOne(id: string) {
    const turma = this.classes.find((c) => c.id === id);
    if (!turma) {
      throw new NotFoundException(`Turma com ID ${id} não encontrada`);
    }
    return turma;
  }

  update(id: string, updateClassDto: UpdateClassDto) {
    const turma = this.findOne(id);
    if (updateClassDto.name) {
      turma.name = updateClassDto.name.toUpperCase();
    }
    return turma;
  }

  remove(id: string) {
    const index = this.classes.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Turma com ID ${id} não encontrada`);
    }
    const [removed] = this.classes.splice(index, 1);
    return { deleted: true, class: removed };
  }
}