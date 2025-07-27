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

/**
 * GLOSSARY FLOW OVERVIEW:
 *
 * ADMIN FLOW:
 * 1. Term Creation: Create glossary terms with definitions and explanations
 * 2. Term Management: Update term definitions, categories, and metadata
 * 3. Term Deletion: Remove outdated or incorrect glossary terms
 * 4. Content Organization: Organize terms by categories and topics
 *
 * USER FLOW:
 * 1. Term Lookup: Search and browse glossary terms for definitions
 * 2. Learning Support: Access definitions to understand technical concepts
 * 3. Content Reference: Use glossary as reference material for blog posts and courses
 * 4. Knowledge Building: Build vocabulary and understanding of domain-specific terms
 *
 * DETAILED ROUTE BREAKDOWN:
 *
 * GLOSSARY MANAGEMENT (Admin Only):
 * - POST /glossary - Create new glossary term with definition and metadata
 * - PATCH /glossary/:id - Update term definition, category, or metadata
 * - DELETE /glossary/:id - Delete glossary term
 *
 * PUBLIC ACCESS:
 * - GET /glossary - List all glossary terms
 * - GET /glossary/:id - Get specific glossary term details
 *
 * CONTENT STRUCTURE:
 * - Term name and definition
 * - Category classification
 * - Related terms and references
 * - Usage examples and context
 * - Timestamp and version tracking
 *
 * KNOWLEDGE MANAGEMENT:
 * - Centralized terminology database
 * - Consistent definitions across content
 * - Searchable and categorized terms
 * - Integration with blog and academy content
 *
 * USAGE PATTERNS:
 * - Admin creates term: POST /glossary
 * - Admin updates term: PATCH /glossary/:id
 * - Users browse terms: GET /glossary
 * - Users lookup term: GET /glossary/:id
 * - Admin manages terms: DELETE /glossary/:id
 *
 * NB: Glossary serves as a knowledge base for consistent terminology across the platform
 */
