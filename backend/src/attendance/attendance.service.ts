import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceEntity } from './entities/attendance.entity';
import { StudentsService } from '../students/students.service';
import { ClassesService } from '../classes/classes.service';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly classesService: ClassesService,
  ) {}

  private attendances: AttendanceEntity[] = [];

  create(createAttendanceDto: CreateAttendanceDto) {
    // Valida se a turma existe
    const turma = this.classesService.findOne(createAttendanceDto.classId);

    // Impede chamada duplicada para a mesma turma na mesma data
    const alreadyExists = this.attendances.some(
      (a) => a.classId === createAttendanceDto.classId && a.date === createAttendanceDto.date,
    );
    if (alreadyExists) {
      throw new BadRequestException(
        `Já existe uma chamada registrada para ${turma.name} na data ${createAttendanceDto.date}`,
      );
    }

    const processedRecords = createAttendanceDto.records.map((record) => {
      const updatedStudent = this.studentsService.registerAttendance(
        record.studentId,
        record.present,
      );
      return {
        studentId: record.studentId,
        studentName: updatedStudent.name,
        present: record.present,
      };
    });

    const newAttendance: AttendanceEntity = {
      id: String(Date.now()),
      classId: createAttendanceDto.classId,
      date: createAttendanceDto.date,
      records: processedRecords,
    };

    this.attendances.push(newAttendance);
    return newAttendance;
  }

  findAll(classId?: string) {
    if (classId) {
      return this.attendances.filter((a) => a.classId === classId);
    }
    return this.attendances;
  }

  findOne(id: string) {
    const attendance = this.attendances.find((a) => a.id === id);
    if (!attendance) {
      throw new NotFoundException(`Chamada com ID ${id} não encontrada`);
    }
    return attendance;
  }

  remove(id: string) {
    const index = this.attendances.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Chamada com ID ${id} não encontrada`);
    }
    const [removed] = this.attendances.splice(index, 1);
    return { deleted: true, attendance: removed };
  }
}