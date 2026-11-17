"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("../students/students.service");
const classes_service_1 = require("../classes/classes.service");
let AttendanceService = class AttendanceService {
    studentsService;
    classesService;
    constructor(studentsService, classesService) {
        this.studentsService = studentsService;
        this.classesService = classesService;
    }
    attendances = [];
    create(createAttendanceDto) {
        const turma = this.classesService.findOne(createAttendanceDto.classId);
        const alreadyExists = this.attendances.some((a) => a.classId === createAttendanceDto.classId && a.date === createAttendanceDto.date);
        if (alreadyExists) {
            throw new common_1.BadRequestException(`Já existe uma chamada registrada para ${turma.name} na data ${createAttendanceDto.date}`);
        }
        const processedRecords = createAttendanceDto.records.map((record) => {
            const updatedStudent = this.studentsService.registerAttendance(record.studentId, record.present);
            return {
                studentId: record.studentId,
                studentName: updatedStudent.name,
                present: record.present,
            };
        });
        const newAttendance = {
            id: String(Date.now()),
            classId: createAttendanceDto.classId,
            date: createAttendanceDto.date,
            records: processedRecords,
        };
        this.attendances.push(newAttendance);
        return newAttendance;
    }
    findAll(classId) {
        if (classId) {
            return this.attendances.filter((a) => a.classId === classId);
        }
        return this.attendances;
    }
    findOne(id) {
        const attendance = this.attendances.find((a) => a.id === id);
        if (!attendance) {
            throw new common_1.NotFoundException(`Chamada com ID ${id} não encontrada`);
        }
        return attendance;
    }
    remove(id) {
        const index = this.attendances.findIndex((a) => a.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Chamada com ID ${id} não encontrada`);
        }
        const [removed] = this.attendances.splice(index, 1);
        return { deleted: true, attendance: removed };
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [students_service_1.StudentsService,
        classes_service_1.ClassesService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map