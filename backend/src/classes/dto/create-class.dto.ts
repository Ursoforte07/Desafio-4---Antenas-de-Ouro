import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClassDto {
  @ApiProperty({ example: 'TURMA 1', description: 'Nome da turma' })
  @IsString()
  @IsNotEmpty({ message: 'O nome da turma é obrigatório' })
  name: string;
}
