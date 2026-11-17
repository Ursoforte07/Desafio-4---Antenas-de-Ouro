import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { AttendanceModule } from './attendance/attendance.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, ClassesModule, StudentsModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}