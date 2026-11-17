import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassEntity } from './entities/class.entity';
import { StudentsService } from '../students/students.service';
export declare class ClassesService {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    private classes;
    create(createClassDto: CreateClassDto): ClassEntity;
    findAll(): {
        id: string;
        name: string;
        totalStudents: number;
        totalLessons: number;
        lowFrequencyCount: number;
        presentPercentage: number;
        absentPercentage: number;
    }[];
    getDashboard(): {
        totalClasses: number;
        totalStudents: number;
        lowFrequencyStudents: number;
        warningStudents: number;
        healthyStudents: number;
        overallPresentPercentage: number;
        overallAbsentPercentage: number;
    };
    findOne(id: string): ClassEntity;
    update(id: string, updateClassDto: UpdateClassDto): ClassEntity;
    remove(id: string): {
        deleted: boolean;
        class: ClassEntity;
    };
}
