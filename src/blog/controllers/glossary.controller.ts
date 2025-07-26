import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateGlossaryDto, UpdateGlossaryDto } from '../dto';
import { GlossaryService } from '../services/glossary.service';
import { Action } from 'src/roles/enums/action.enum';
import { Resource } from 'src/roles/enums/resource.enum';
import { Permissions } from 'src/roles/decorator/permissions.decorator';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';

@Controller('glossary')
export class GlossaryController {
  constructor(private readonly glossaryService: GlossaryService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.GLOSSARY, actions: [Action.CREATE] }])
  async create(@Body() createGlossaryDto: CreateGlossaryDto) {
    return await this.glossaryService.create({ createGlossaryDto });
  }

  @Get()
  async getAllGlossary() {
    return await this.glossaryService.getAllGlossary();
  }

  @Get(':id')
  async getGlossaryById(@Param('id') id: string) {
    return await this.glossaryService.getGlossaryById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGlossaryDto: UpdateGlossaryDto,
  ) {
    return await this.glossaryService.update({ id, updateGlossaryDto });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.glossaryService.delete(id);
  }
}
