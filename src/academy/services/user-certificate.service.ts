import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserCertificate,
  UserCertificateDocument,
} from '../entities/user-certificate.entity';
import { User, UserDocument } from 'src/user/entities/user.entity';
import {
  Certificate,
  CertificateDocument,
} from '../entities/certificate.entity';
import { Course, CourseDocument } from '../entities/course.entity';

@Injectable()
export class UserCertificateService {
  constructor(
    @InjectModel(UserCertificate.name)
    private userCertificateModel: Model<UserCertificateDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,

    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
  ) {}

  async getUserCertificates(userId: string) {
    const certificates = await this.userCertificateModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('certificateId', 'title description issuedBy')
      .populate('courseId', 'title description category')
      .sort({ issuedAt: -1 });

    return certificates;

    // return certificates.map((cert) => ({
    //   id: cert._id.toString(),
    //   certificateNumber: cert.certificateNumber,
    //   title: cert.certificateId.title,
    //   description: cert.certificateId.description,
    //   issuedBy: cert.certificateId.issuedBy,
    //   courseTitle: cert.courseId.title,
    //   courseCategory: cert.courseId.category,
    //   finalScore: cert.finalScore,
    //   xpEarned: cert.xpEarned,
    //   issuedAt: cert.issuedAt.toISOString(),
    // }));
  }

  async getCertificateById(certificateId: string) {
    const certificate = await this.userCertificateModel
      .findById(certificateId)
      .populate('userId', 'firstName lastName email')
      .populate('certificateId', 'title description issuedBy')
      .populate('courseId', 'title description category');

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate;

    // return {
    //   id: certificate._id.toString(),
    //   certificateNumber: certificate.certificateNumber,
    //   user: {
    //     id: certificate.userId._id.toString(),
    //     firstName: certificate.userId.firstName,
    //     lastName: certificate.userId.lastName,
    //     email: certificate.userId.email,
    //   },
    //   certificate: {
    //     title: certificate.certificateId.title,
    //     description: certificate.certificateId.description,
    //     issuedBy: certificate.certificateId.issuedBy,
    //   },
    //   course: {
    //     title: certificate.courseId.title,
    //     description: certificate.courseId.description,
    //     category: certificate.courseId.category,
    //   },
    //   finalScore: certificate.finalScore,
    //   xpEarned: certificate.xpEarned,
    //   issuedAt: certificate.issuedAt.toISOString(),
    // };
  }

  async generateCertificatePDF(certificateId: string) {
    const certificate = await this.getCertificateById(certificateId);

    // This would integrate with a PDF generation service
    // For now, return the certificate data that can be used to generate PDF
    return {
      certificate,
      pdfUrl: `/certificates/${certificateId}/pdf`, // Placeholder for PDF generation
      message: 'PDF generation endpoint - integrate with PDF service',
    };
  }

  async verifyCertificate(certificateNumber: string) {
    const certificate = await this.userCertificateModel
      .findOne({ certificateNumber })
      .populate('userId', 'firstName lastName email')
      .populate('certificateId', 'title description issuedBy')
      .populate('courseId', 'title description category');

    if (!certificate) {
      throw new NotFoundException('Certificate not found or invalid');
    }

    return certificate;

    // return {
    //   isValid: true,
    //   certificate: {
    //     id: certificate._id.toString(),
    //     certificateNumber: certificate.certificateNumber,
    //     user: {
    //       firstName: certificate.userId.firstName,
    //       lastName: certificate.userId.lastName,
    //       email: certificate.userId.email,
    //     },
    //     title: certificate.certificateId.title,
    //     issuedBy: certificate.certificateId.issuedBy,
    //     courseTitle: certificate.courseId.title,
    //     finalScore: certificate.finalScore,
    //     issuedAt: certificate.issuedAt.toISOString(),
    //   },
    // };
  }

  async getCertificateStats(userId: string) {
    const certificates = await this.userCertificateModel.find({
      userId: new Types.ObjectId(userId),
    });

    const totalCertificates = certificates.length;
    const totalXPEarned = certificates.reduce(
      (sum, cert) => sum + cert.xpEarned,
      0,
    );
    const averageScore =
      certificates.length > 0
        ? certificates.reduce((sum, cert) => sum + cert.finalScore, 0) /
          certificates.length
        : 0;

    // Get certificates by category
    const certificatesWithCourses = await this.userCertificateModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('courseId', 'category');

    const categoryStats = certificatesWithCourses.reduce((acc: Record<string, number>, cert) => {
      const category = (cert.courseId as any).category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalCertificates,
      totalXPEarned,
      averageScore: Math.round(averageScore),
      categoryStats,
      certificates: certificates.map((cert) => ({
        id: cert._id.toString(),
        certificateNumber: cert.certificateNumber,
        finalScore: cert.finalScore,
        xpEarned: cert.xpEarned,
        issuedAt: cert.issuedAt.toISOString(),
      })),
    };
  }

  async getRecentCertificates(limit: number = 10) {
    const certificates = await this.userCertificateModel
      .find()
      .populate('userId', 'firstName lastName')
      .populate('certificateId', 'title')
      .populate('courseId', 'title category')
      .sort({ issuedAt: -1 })
      .limit(limit);

    return certificates;

    // return certificates.map((cert) => ({
    //   id: cert._id.toString(),
    //   certificateNumber: cert.certificateNumber,
    //   user: {
    //     firstName: cert.userId.firstName,
    //     lastName: cert.userId.lastName,
    //   },
    //   certificateTitle: cert.certificateId.title,
    //   courseTitle: cert.courseId.title,
    //   courseCategory: cert.courseId.category,
    //   finalScore: cert.finalScore,
    //   issuedAt: cert.issuedAt.toISOString(),
    // }));
  }
}
