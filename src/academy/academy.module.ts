import { Module } from '@nestjs/common';
import { AcademyService } from './services/academy.service';
import { AcademyController } from './academy.controller';

@Module({
  controllers: [AcademyController],
  providers: [AcademyService],
})
export class AcademyModule {}
