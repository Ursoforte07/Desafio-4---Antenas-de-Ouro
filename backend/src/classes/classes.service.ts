import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassEntity } from './entities/class.entity';

@Injectable()
export class ClassesService {
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
    return this.classes.map((turma) => ({
      id: turma.id,
      name: turma.name,
      totalStudents: 20,
      totalLessons: 10,
      lowFrequencyCount: 2,
      presentPercentage: 88,
      absentPercentage: 12,
    }));
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