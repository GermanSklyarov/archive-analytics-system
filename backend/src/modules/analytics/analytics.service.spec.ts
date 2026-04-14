import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { ArchiveRecord } from '../archive-records/entities/archive-record.entity';
import { ResultsService } from '../results/results.service';
import { AnalyticsRequest } from './entities/analytics.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  const archiveRepoMock = {
    createQueryBuilder: jest.fn(),
  };
  const analyticsRepoMock = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
  const resultsServiceMock = {
    saveResult: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(ArchiveRecord),
          useValue: archiveRepoMock,
        },
        {
          provide: ResultsService,
          useValue: resultsServiceMock,
        },
        {
          provide: getRepositoryToken(AnalyticsRequest),
          useValue: analyticsRepoMock,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
