import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEntity } from './entities/student.entity';
export declare class StudentsService {
    private students;
    calculateStatus(present: number, total: number): {
        attendancePercentage: number;
        statusColor: "RED" | "YELLOW" | "GREEN";
    };
    create(createStudentDto: CreateStudentDto): {
        attendancePercentage: number;
        statusColor: "RED" | "YELLOW" | "GREEN";
        id: string;
        name: string;
        classId: string;
        presentLessons: number;
        totalLessons: number;
    };
    findAll(search?: string, sortBy?: 'status' | 'class', order?: 'asc' | 'desc', classId?: string): {
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
    registerAttendance(studentId: string, present: boolean): {
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
        student: StudentEntity;
    };
}
