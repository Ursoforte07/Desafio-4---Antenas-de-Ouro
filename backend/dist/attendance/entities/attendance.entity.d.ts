export declare class AttendanceEntity {
    id: string;
    classId: string;
    date: string;
    records: {
        studentId: string;
        studentName: string;
        present: boolean;
    }[];
}
