import { Test, TestingModule } from '@nestjs/testing';
import { DayScheduleController } from './day-schedule.controller';

describe('DayScheduleController', () => {
  let controller: DayScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DayScheduleController],
    }).compile();

    controller = module.get<DayScheduleController>(DayScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
