import { Module } from '@nestjs/common';
import { DayScheduleController } from './day-schedule.controller';
import { DayScheduleService } from './day-schedule.service';

@Module({
  controllers: [DayScheduleController],
  providers: [DayScheduleService]
})
export class DayScheduleModule {}
