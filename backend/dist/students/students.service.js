"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
let StudentsService = class StudentsService {
    students = [
        { id: '1', name: 'AMANDA CASTRO NOGUEIRA BARBOSA', classId: '1', presentLessons: 8, totalLessons: 9 },
        { id: '2', name: 'ARTHUR OLIVEIRA SANTOS COSTA', classId: '2', presentLessons: 19, totalLessons: 25 },
        { id: '3', name: 'ALICE REIS OLIVEIRA ARAÚJO', classId: '1', presentLessons: 10, totalLessons: 11 },
        { id: '4', name: 'AMÉLIO CARDOSO FERREIRO DE MELO', classId: '2', presentLessons: 7, totalLessons: 10 },
    ];
    calculateStatus(present, total) {
        const percentage = total === 0 ? 100 : Math.round((present / total) * 100);
        let statusColor = 'GREEN';
        if (percentage <= 74) {
            statusColor = 'RED';
        }
        else if (percentage <= 84) {
            statusColor = 'YELLOW';
        }
        return { attendancePercentage: percentage, statusColor };
    }
    create(createStudentDto) {
        const newStudent = {
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
    findAll(search, sortBy, order = 'asc', classId) {
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
            result.sort((a, b) => order === 'asc'
                ? a.attendancePercentage - b.attendancePercentage
                : b.attendancePercentage - a.attendancePercentage);
        }
        else if (sortBy === 'class') {
            result.sort((a, b) => order === 'asc'
                ? a.classId.localeCompare(b.classId)
                : b.classId.localeCompare(a.classId));
        }
        return result;
    }
    findOne(id) {
        const student = this.students.find((s) => s.id === id);
        if (!student) {
            throw new common_1.NotFoundException(`Aluno com ID ${id} não encontrado`);
        }
        const { attendancePercentage, statusColor } = this.calculateStatus(student.presentLessons, student.totalLessons);
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
    registerAttendance(studentId, present) {
        const student = this.students.find((s) => s.id === studentId);
        if (!student) {
            throw new common_1.NotFoundException(`Aluno com ID ${studentId} não encontrado`);
        }
        student.totalLessons += 1;
        if (present) {
            student.presentLessons += 1;
        }
        return this.findOne(studentId);
    }
    update(id, updateStudentDto) {
        const student = this.students.find((s) => s.id === id);
        if (!student) {
            throw new common_1.NotFoundException(`Aluno com ID ${id} não encontrado`);
        }
        if (updateStudentDto.name) {
            student.name = updateStudentDto.name.toUpperCase();
        }
        if (updateStudentDto.classId) {
            student.classId = updateStudentDto.classId;
        }
        return this.findOne(id);
    }
    remove(id) {
        const index = this.students.findIndex((s) => s.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Aluno com ID ${id} não encontrado`);
        }
        const [removed] = this.students.splice(index, 1);
        return { deleted: true, student: removed };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)()
], StudentsService);
//# sourceMappingURL=students.service.js.map