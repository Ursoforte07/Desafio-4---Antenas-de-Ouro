import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    create(createClassDto: CreateClassDto): import("./entities/class.entity").ClassEntity;
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
    findOne(id: string): import("./entities/class.entity").ClassEntity;
    update(id: string, updateClassDto: UpdateClassDto): import("./entities/class.entity").ClassEntity;
    remove(id: string): {
        deleted: boolean;
        class: import("./entities/class.entity").ClassEntity;
    };
}
