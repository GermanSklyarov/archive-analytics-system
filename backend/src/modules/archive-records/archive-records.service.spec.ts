import { Test, TestingModule } from '@nestjs/testing';
import { ArchiveRecordsService } from './archive-records.service';

describe('ArchiveRecordsService', () => {
  let service: ArchiveRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchiveRecordsService],
    }).compile();

    service = module.get<ArchiveRecordsService>(ArchiveRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
