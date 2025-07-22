import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AcademyService } from './services/academy.service';

@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}
}
