import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@ApiTags('Chamadas')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar chamada de uma aula e atualizar frequência dos alunos' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar histórico de chamadas realizadas' })
  @ApiQuery({ name: 'classId', required: false, description: 'Filtrar chamadas por ID da turma' })
  findAll(@Query('classId') classId?: string) {
    return this.attendanceService.findAll(classId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de uma chamada específica' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um registro de chamada' })
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}