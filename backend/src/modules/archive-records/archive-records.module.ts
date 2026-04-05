import { Module } from '@nestjs/common';
import { ArchiveRecordsService } from './archive-records.service';
import { ArchiveRecordsController } from './archive-records.controller';
import { ArchiveRecord } from './entities/archive-record.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArchiveRecord])],
  controllers: [ArchiveRecordsController],
  providers: [ArchiveRecordsService],
})
export class ArchiveRecordsModule {}
