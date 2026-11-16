import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEntity } from './entities/student.entity';

@Injectable()
export class StudentsService {
  private students: StudentEntity[] = [
    { id: '1', name: 'AMANDA CASTRO NOGUEIRA BARBOSA', classId: '1', presentLessons: 8, totalLessons: 9 },
    { id: '2', name: 'ARTHUR OLIVEIRA SANTOS COSTA', classId: '2', presentLessons: 19, totalLessons: 25 },
    { id: '3', name: 'ALICE REIS OLIVEIRA ARAÚJO', classId: '1', presentLessons: 10, totalLessons: 11 },
    { id: '4', name: 'AMÉLIO CARDOSO FERREIRO DE MELO', classId: '2', presentLessons: 7, totalLessons: 10 },
  ];

  calculateStatus(present: number, total: number) {
    const percentage = total === 0 ? 100 : Math.round((present / total) * 100);
    let statusColor: 'RED' | 'YELLOW' | 'GREEN' = 'GREEN';

    if (percentage <= 74) {
      statusColor = 'RED';
    } else if (percentage <= 84) {
      statusColor = 'YELLOW';
    }

    return { attendancePercentage: percentage, statusColor };
  }

  create(createStudentDto: CreateStudentDto) {
    const newStudent: StudentEntity = {
      id: String(Date.now()),
      name: createStudentDto.name.toUpperCase(),
      classId: createStudentDto.classId,
      presentLessons: 0,
      totalLessons: 0,
    };
    this.students.push(newStudent);
    return {
      ...newStudent,
      ...this.calculateStatus(newStudent.presentLessons, newStudent.totalLessons),
    };
  }

  findAll(search?: string, sortBy?: 'status' | 'class', order: 'asc' | 'desc' = 'asc', classId?: string) {
    let result = this.students.map((student) => ({
      id: student.id,
      name: student.name,
      classId: student.classId,
      presentLessons: student.presentLessons,
      totalLessons: student.totalLessons,
      ...this.calculateStatus(student.presentLessons, student.totalLessons),
    }));

    if (classId) {
      result = result.filter((s) => s.classId === classId);
    }

    if (search) {
      const term = search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(term));
    }

    if (sortBy === 'status') {
      result.sort((a, b) =>
        order === 'asc'
          ? a.attendancePercentage - b.attendancePercentage
          : b.attendancePercentage - a.attendancePercentage,
      );
    } else if (sortBy === 'class') {
      result.sort((a, b) =>
        order === 'asc'
          ? a.classId.localeCompare(b.classId)
          : b.classId.localeCompare(a.classId),
      );
    }

    return result;
  }

  findOne(id: string) {
    const student = this.students.find((s) => s.id === id);
    if (!student) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
    }
    const { attendancePercentage, statusColor } = this.calculateStatus(
      student.presentLessons,
      student.totalLessons,
    );

    return {
      id: student.id,
      name: student.name,
      classId: student.classId,
      presentLessons: student.presentLessons,
      absentLessons: student.totalLessons - student.presentLessons,
      totalLessons: student.totalLessons,
      attendancePercentage,
      statusColor,
    };
  }

  // Método chamado automaticamente quando uma aula é registrada
  registerAttendance(studentId: string, present: boolean) {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) {
      throw new NotFoundException(`Aluno com ID ${studentId} não encontrado`);
    }
    student.totalLessons += 1;
    if (present) {
      student.presentLessons += 1;
    }
    return this.findOne(studentId);
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = this.students.find((s) => s.id === id);
    if (!student) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
    }
    if (updateStudentDto.name) {
      student.name = updateStudentDto.name.toUpperCase();
    }
    if (updateStudentDto.classId) {
      student.classId = updateStudentDto.classId;
    }
    return this.findOne(id);
  }

  remove(id: string) {
    const index = this.students.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
    }
    const [removed] = this.students.splice(index, 1);
    return { deleted: true, student: removed };
  }
}