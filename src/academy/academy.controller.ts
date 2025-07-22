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
import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from './dto/certificate.dto';

@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  @Get('all-certificate')
  async allCertificate() {
    return this.academyService.findAllCertificate();
  }

  @Get('certificate/:id')
  async singleCertificate(@Param('id') id: string) {
    return this.academyService.findCertificateById(id);
  }

  @Post('create-certificate')
  async createCertificate(@Body() createCertificateDto: CreateCertificateDto) {
    return this.academyService.createCertificate(createCertificateDto);
  }

  @Patch('update-certificate/:id')
  async updateCertificate(
    @Body() updateCertificateDto: UpdateCertificateDto,
    @Param('id') id: string,
  ) {
    return this.academyService.updateCertificate({ id, updateCertificateDto });
  }
}
