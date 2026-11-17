import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto): {
        attendancePercentage: number;
        statusColor: "RED" | "YELLOW" | "GREEN";
        id: string;
        name: string;
        classId: string;
        presentLessons: number;
        totalLessons: number;
    };
    findAll(search?: string, classId?: string, sortBy?: 'status' | 'class', order?: 'asc' | 'desc'): {
        attendancePercentage: number;
        statusColor: "RED" | "YELLOW" | "GREEN";
        id: string;
        name: string;
        classId: string;
        presentLessons: number;
        totalLessons: number;
    }[];
    findOne(id: string): {
        id: string;
        name: string;
        classId: string;
        presentLessons: number;
        absentLessons: number;
        totalLessons: number;
        attendancePercentage: number;
        statusColor: "RED" | "YELLOW" | "GREEN";
    };
    update(id: string, updateStudentDto: UpdateStudentDto): {
        id: string;
        name: string;
        classId: string;
        presentLessons: number;
        absentLessons: number;
        totalLessons: number;
        attendancePercentage: number;
        statusColor: "RED" | "YELLOW" | "GREEN";
    };
    remove(id: string): {
        deleted: boolean;
        student: import("./entities/student.entity").StudentEntity;
    };
}
