import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class StudentAttendanceRecordDto {
  @ApiProperty({ example: '1', description: 'ID do aluno' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ example: true, description: 'true = Presente, false = Falta' })
  @IsBoolean()
  present: boolean;
}

export class CreateAttendanceDto {
  @ApiProperty({ example: '1', description: 'ID da turma' })
  @IsString()
  @IsNotEmpty({ message: 'O ID da turma é obrigatório' })
  classId: string;

  @ApiProperty({ example: '2026-11-16', description: 'Data da aula (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty({ message: 'A data da aula é obrigatória' })
  date: string;

  @ApiProperty({
    type: [StudentAttendanceRecordDto],
    description: 'Lista de presença dos alunos na aula',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Envie pelo menos um registro de aluno' })
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceRecordDto)
  records: StudentAttendanceRecordDto[];
}