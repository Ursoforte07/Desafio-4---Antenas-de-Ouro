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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("../students/students.service");
let ClassesService = class ClassesService {
    studentsService;
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    classes = [
        { id: '1', name: 'TURMA 1' },
        { id: '2', name: 'TURMA 2' },
    ];
    create(createClassDto) {
        const newClass = {
            id: String(Date.now()),
            name: createClassDto.name.toUpperCase(),
        };
        this.classes.push(newClass);
        return newClass;
    }
    findAll() {
        const allStudents = this.studentsService.findAll();
        return this.classes.map((turma) => {
            const classStudents = allStudents.filter((s) => s.classId === turma.id);
            const totalStudents = classStudents.length;
            const totalLessons = totalStudents > 0 ? Math.max(...classStudents.map((s) => s.totalLessons)) : 0;
            const lowFrequencyCount = classStudents.filter((s) => s.statusColor === 'RED').length;
            const presentPercentage = totalStudents > 0
                ? Math.round(classStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / totalStudents)
                : 100;
            return {
                id: turma.id,
                name: turma.name,
                totalStudents,
                totalLessons,
                lowFrequencyCount,
                presentPercentage,
                absentPercentage: 100 - presentPercentage,
            };
        });
    }
    getDashboard() {
        const classesStats = this.findAll();
        const allStudents = this.studentsService.findAll();
        const totalClasses = classesStats.length;
        const totalStudents = allStudents.length;
        const lowFrequencyStudents = allStudents.filter((s) => s.statusColor === 'RED').length;
        const warningStudents = allStudents.filter((s) => s.statusColor === 'YELLOW').length;
        const healthyStudents = allStudents.filter((s) => s.statusColor === 'GREEN').length;
        const overallPresentPercentage = totalStudents > 0
            ? Math.round(allStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / totalStudents)
            : 100;
        return {
            totalClasses,
            totalStudents,
            lowFrequencyStudents,
            warningStudents,
            healthyStudents,
            overallPresentPercentage,
            overallAbsentPercentage: 100 - overallPresentPercentage,
        };
    }
    findOne(id) {
        const turma = this.classes.find((c) => c.id === id);
        if (!turma) {
            throw new common_1.NotFoundException(`Turma com ID ${id} não encontrada`);
        }
        return turma;
    }
    update(id, updateClassDto) {
        const turma = this.findOne(id);
        if (updateClassDto.name) {
            turma.name = updateClassDto.name.toUpperCase();
        }
        return turma;
    }
    remove(id) {
        const index = this.classes.findIndex((c) => c.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Turma com ID ${id} não encontrada`);
        }
        const [removed] = this.classes.splice(index, 1);
        return { deleted: true, class: removed };
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], ClassesService);
//# sourceMappingURL=classes.service.js.map