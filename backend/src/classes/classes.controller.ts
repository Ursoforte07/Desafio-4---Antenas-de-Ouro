import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@ApiTags('Turmas')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova turma' })
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as turmas com estatísticas em tempo real' })
  findAll() {
    return this.classesService.findAll();
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Resumo geral de indicadores para o Dashboard' })
  getDashboard() {
    return this.classesService.getDashboard();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma turma pelo ID' })
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar nome da turma' })
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma turma' })
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
}