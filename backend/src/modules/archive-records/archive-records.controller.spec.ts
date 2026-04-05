import { Test, TestingModule } from '@nestjs/testing';
import { ArchiveRecordsController } from './archive-records.controller';
import { ArchiveRecordsService } from './archive-records.service';

describe('ArchiveRecordsController', () => {
  let controller: ArchiveRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchiveRecordsController],
      providers: [ArchiveRecordsService],
    }).compile();

    controller = module.get<ArchiveRecordsController>(ArchiveRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
