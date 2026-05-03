import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArchiveRecordsService } from './archive-records.service';
import { ArchiveRecord } from './entities/archive-record.entity';

describe('ArchiveRecordsService', () => {
  let service: ArchiveRecordsService;
  const archiveRepoMock = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    findOneOrFail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArchiveRecordsService,
        {
          provide: getRepositoryToken(ArchiveRecord),
          useValue: archiveRepoMock,
        },
      ],
    }).compile();

    service = module.get<ArchiveRecordsService>(ArchiveRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('does not auto-map metric columns as unit columns', () => {
    const mapping = (
      service as unknown as {
        autoDetectMapping: (columns: string[]) => {
          created_at?: string;
          unit?: string;
        };
      }
    ).autoDetectMapping([
      'Дата',
      'Среднее содержание в руде / г/т',
      'Металл в руде / гр',
      'Извлечение / %',
    ]);

    expect(mapping.created_at).toBe('Дата');
    expect(mapping.unit).toBe('');
  });
});
