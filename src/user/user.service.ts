import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { RolesService } from 'src/roles/roles.service';
import { RoleResponseDto } from 'src/roles/dto/role.dto';
import { NewsletterService } from 'src/newsletter/newsletter.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly adminCode = 'small_bytes_admin';
  private readonly newsletterXP = 10;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly rolesService: RolesService,

    private readonly newsletterService: NewsletterService,
  ) {}

  async create(createData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    code?: string;
  }): Promise<UserResponseDto> {
    try {
      const { email, code } = createData;
      const existingUser = await this.findUserByEmail(email);

      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.FORBIDDEN);
      }

      let role: RoleResponseDto;

      if (code && code === this.adminCode) {
        role = await this.rolesService.getRoleByName('admin');
      } else {
        role = await this.rolesService.getRoleByName('learner');
      }

      // creating user
      const user = await this.userModel.create({
        ...createData,
        xp: this.newsletterXP,
        roleId: new Types.ObjectId(role._id),
      });

      this.logger.debug(`User created....`);
      this.logger.debug(`Creating newsletter`);

      await this.newsletterService.create({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tags: ['small-bytes', 'blockchain'],
      });

      this.logger.debug(`Newsletter created`);

      return plainToInstance(UserResponseDto, user.toObject());
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error creating user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({
        email: email,
      });

      return user;
    } catch (error) {
      throw new HttpException(
        `Error finding user using email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserById(id: string | number): Promise<User> {
    try {
      const user = await this.userModel.findById(id);

      return user;
    } catch (error) {
      throw new HttpException(
        `Error finding user with id ${id}... : ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserPermissions(userId: string): Promise<RoleResponseDto> {
    const user = await this.findUserById(userId);

    const userPermissions = await this.rolesService.getRoleById(
      user.roleId.toString(),
    );

    return userPermissions;
  }

  async updateUserXp({ userId, points }: { userId: string; points: number }) {
    try {
      const user = await this.findUserById(userId);

      if (!user) {
        throw new HttpException(
          `No user found with ID: ${userId}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      user.xp += points;
      return await user.save();
    } catch (error) {
      throw new HttpException(
        `Error updating user XP`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
