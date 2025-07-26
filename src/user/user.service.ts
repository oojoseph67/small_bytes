import { HttpException, HttpStatus, Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { RolesService } from 'src/roles/roles.service';
import { RoleResponseDto } from 'src/roles/dto/role.dto';
import { NewsletterService } from 'src/newsletter/newsletter.service';
import { XPHistoryService } from 'src/academy/services/xp-history.service';
import { XPActivityType } from 'src/academy/entities/xp-history.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly adminCode = 'small_bytes_admin';

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly rolesService: RolesService,

    private readonly newsletterService: NewsletterService,

    @Inject(forwardRef(() => XPHistoryService))
    private readonly xpHistoryService: XPHistoryService,
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
        roleId: new Types.ObjectId(role._id),
      });

      this.logger.debug(`User created....`);
      this.logger.debug(`Adding signup XP`);

      await this.xpHistoryService.addSignupXP(user._id.toString());

      this.logger.debug(`Creating newsletter`);

      await this.newsletterService.create({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tags: ['small-bytes', 'blockchain'],
      });

      this.logger.debug(`Newsletter created`);

      // Fetch the updated user with the new XP
      const updatedUser = await this.findUserById(user._id.toString());

      return plainToInstance(UserResponseDto, updatedUser.toObject());
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

      // Use XP history service to add XP
      await this.xpHistoryService.addXP(
        userId,
        points,
        XPActivityType.BONUS,
        `Manual XP adjustment: ${points > 0 ? '+' : ''}${points} XP`,
      );

      // Return the updated user
      return await this.findUserById(userId);
    } catch (error) {
      throw new HttpException(
        `Error updating user XP`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
