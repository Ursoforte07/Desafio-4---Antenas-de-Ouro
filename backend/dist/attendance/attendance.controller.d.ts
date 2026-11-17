import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(createAttendanceDto: CreateAttendanceDto): import("./entities/attendance.entity").AttendanceEntity;
    findAll(classId?: string): import("./entities/attendance.entity").AttendanceEntity[];
    findOne(id: string): import("./entities/attendance.entity").AttendanceEntity;
    remove(id: string): {
        deleted: boolean;
        attendance: import("./entities/attendance.entity").AttendanceEntity;
    };
}
