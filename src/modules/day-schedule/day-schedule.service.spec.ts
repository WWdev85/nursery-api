import { Test, TestingModule } from '@nestjs/testing';
import { DayScheduleService } from './day-schedule.service';

describe('DayScheduleService', () => {
  let service: DayScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DayScheduleService],
    }).compile();

    service = module.get<DayScheduleService>(DayScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
