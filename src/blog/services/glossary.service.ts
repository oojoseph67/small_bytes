import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GlossaryTerm, GlossaryTermDocument } from '../entities';
import { Model } from 'mongoose';
import { CreateGlossaryDto, UpdateGlossaryDto } from '../dto';

@Injectable()
export class GlossaryService {
  private readonly logger = new Logger(GlossaryService.name);

  constructor(
    @InjectModel(GlossaryTerm.name)
    private readonly glossaryTermModel: Model<GlossaryTermDocument>,
  ) {}

  async create({
    createGlossaryDto,
  }: {
    createGlossaryDto: CreateGlossaryDto;
  }): Promise<GlossaryTermDocument> {
    try {
      this.logger.debug('creating glossary term');

      return await this.glossaryTermModel.create({
        ...createGlossaryDto,
      });
    } catch (error: any) {
      this.logger.error('error creating glossary term', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error creating blog: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update({
    id,
    updateGlossaryDto,
  }: {
    id: string;
    updateGlossaryDto: UpdateGlossaryDto;
  }) {
    try {
      const glossaryTerm = await this.glossaryTermModel.findByIdAndUpdate(
        id,
        {
          ...updateGlossaryDto,
        },
        { new: true, runValidators: true },
      );
      if (!glossaryTerm) {
        throw new HttpException(
          `Glossary term with ID '${id}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.debug(`glossary term updated successfully`);
      return glossaryTerm;
    } catch (error: any) {
      this.logger.error('error finding glossary terms', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error glossary terms: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllGlossary(): Promise<GlossaryTermDocument[]> {
    this.logger.debug('fetching all glossary terms');

    try {
      return await this.glossaryTermModel.find().sort({ createdAt: -1 }).exec();
    } catch (error: any) {
      this.logger.error('error finding glossary terms', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error glossary terms: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGlossaryById(id: string): Promise<GlossaryTermDocument> {
    this.logger.debug(`fetching glossary term by id: ${id}`);

    try {
      const glossaryTerm = await this.glossaryTermModel.findById(id).exec();

      if (!glossaryTerm) {
        throw new HttpException(
          `Glossary term with ID '${id}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return glossaryTerm;
    } catch (error: any) {
      this.logger.error('error finding glossary term', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error finding glossary term: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string) {
    this.logger.debug(`deleting glossary term with id: ${id}`);

    try {
      const glossaryTerm = await this.glossaryTermModel.findByIdAndDelete(id);

      if (!glossaryTerm) {
        throw new HttpException(
          `Glossary term with ID '${id}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return 'Glossary term deleted successfully';
    } catch (error: any) {
      this.logger.error('error deleting glossary term', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error deleting glossary term: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
