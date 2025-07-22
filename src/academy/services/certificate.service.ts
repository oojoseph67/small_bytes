import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Certificate } from '../entities/certificate.entity';
import { Model } from 'mongoose';
import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from '../dto/certificate.dto';

@Injectable()
export class CertificateService {
  private readonly logger = new Logger(CertificateService.name);

  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,
  ) {}

  async createCertificate(
    createCertificateDto: CreateCertificateDto,
  ): Promise<Certificate> {
    try {
      return await this.certificateModel.create({
        ...createCertificateDto,
      });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error creating certificate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCertificate({
    id,
    updateCertificateDto,
  }: {
    id: string;
    updateCertificateDto: UpdateCertificateDto;
  }): Promise<Certificate> {
    try {
      const updatedCertificate = await this.certificateModel.findByIdAndUpdate(
        id,
        { $set: updateCertificateDto },
        { new: true, runValidators: true },
      );

      if (!updatedCertificate) {
        throw new HttpException('Certificate not found', HttpStatus.NOT_FOUND);
      }

      return updatedCertificate;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error creating certificate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllCertificate(): Promise<Certificate[]> {
    try {
      return await this.certificateModel.find().exec();
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error finding certificate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCertificateById(id: string): Promise<Certificate> {
    try {
      return await this.certificateModel.findById(id);
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error finding certificate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCertificateByTitle(title: string): Promise<Certificate> {
    try {
      return await this.certificateModel.findOne({ title });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error finding certificate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
