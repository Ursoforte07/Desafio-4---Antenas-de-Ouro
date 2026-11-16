import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'AMANDA CASTRO NOGUEIRA BARBOSA' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do aluno é obrigatório' })
  name: string;

  @ApiProperty({ example: '1', description: 'ID da turma à qual o aluno pertence' })
  @IsString()
  @IsNotEmpty({ message: 'O ID da turma é obrigatório' })
  classId: string;
}