import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@ApiTags('Alunos')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo aluno em uma turma' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar alunos com busca por nome, filtro por turma e ordenação' })
  @ApiQuery({ name: 'search', required: false, description: 'Filtrar por nome do aluno' })
  @ApiQuery({ name: 'classId', required: false, description: 'Filtrar por ID da turma' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['status', 'class'] })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  findAll(
    @Query('search') search?: string,
    @Query('classId') classId?: string,
    @Query('sortBy') sortBy?: 'status' | 'class',
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.studentsService.findAll(search, sortBy, order, classId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de frequência de um aluno' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do aluno' })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um aluno' })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}