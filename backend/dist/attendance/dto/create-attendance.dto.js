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
exports.CreateAttendanceDto = exports.StudentAttendanceRecordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class StudentAttendanceRecordDto {
    studentId;
    present;
}
exports.StudentAttendanceRecordDto = StudentAttendanceRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'ID do aluno' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StudentAttendanceRecordDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'true = Presente, false = Falta' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], StudentAttendanceRecordDto.prototype, "present", void 0);
class CreateAttendanceDto {
    classId;
    date;
    records;
}
exports.CreateAttendanceDto = CreateAttendanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', description: 'ID da turma' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID da turma é obrigatório' }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "classId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-11-16', description: 'Data da aula (YYYY-MM-DD)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data da aula é obrigatória' }),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [StudentAttendanceRecordDto],
        description: 'Lista de presença dos alunos na aula',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Envie pelo menos um registro de aluno' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StudentAttendanceRecordDto),
    __metadata("design:type", Array)
], CreateAttendanceDto.prototype, "records", void 0);
//# sourceMappingURL=create-attendance.dto.js.map