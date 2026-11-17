export declare class StudentAttendanceRecordDto {
    studentId: string;
    present: boolean;
}
export declare class CreateAttendanceDto {
    classId: string;
    date: string;
    records: StudentAttendanceRecordDto[];
}
