import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { RolesService } from 'src/roles/roles.service';
import { RoleResponseDto } from 'src/roles/dto/role.dto';
import { NewsletterService } from 'src/newsletter/newsletter.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

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
  }): Promise<UserResponseDto> {
    try {
      const { email } = createData;
      const existingUser = await this.findUserByEmail(email);

      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.FORBIDDEN);
      }

      const role = await this.rolesService.getRoleByName('learner');

      // creating user
      const user = await this.userModel.create({
        ...createData,
        roleId: role._id,
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
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = this.userModel.findOne({
        email: email,
      });

      return user;
    } catch (error) {
      throw new HttpException(
        `Error finding user using email: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async findUserById(id: string | number): Promise<User> {
    try {
      const user = this.userModel.findById(id);

      return user;
    } catch (error) {
      throw new HttpException(
        `Error finding user with id ${id}... : ${error.message}`,
        HttpStatus.BAD_GATEWAY,
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
}
