import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceEntity } from './entities/attendance.entity';
import { StudentsService } from '../students/students.service';
import { ClassesService } from '../classes/classes.service';
export declare class AttendanceService {
    private readonly studentsService;
    private readonly classesService;
    constructor(studentsService: StudentsService, classesService: ClassesService);
    private attendances;
    create(createAttendanceDto: CreateAttendanceDto): AttendanceEntity;
    findAll(classId?: string): AttendanceEntity[];
    findOne(id: string): AttendanceEntity;
    remove(id: string): {
        deleted: boolean;
        attendance: AttendanceEntity;
    };
}
