import { Test, TestingModule } from '@nestjs/testing';
import { ArchiveRecordsController } from './archive-records.controller';
import { ArchiveRecordsService } from './archive-records.service';

describe('ArchiveRecordsController', () => {
  let controller: ArchiveRecordsController;
  const archiveRecordsServiceMock = {
    create: jest.fn(),
    importFromFile: jest.fn(),
    previewImport: jest.fn(),
    previewWithMapping: jest.fn(),
    findAll: jest.fn(),
    getMeta: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    removeMany: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchiveRecordsController],
      providers: [
        {
          provide: ArchiveRecordsService,
          useValue: archiveRecordsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ArchiveRecordsController>(ArchiveRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
