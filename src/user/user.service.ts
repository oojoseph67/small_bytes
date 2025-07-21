import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(createData: {
    email: string;
    name: string;
    password: string;
  }): Promise<UserResponseDto> {
    try {
      const { email } = createData;
      const existingUser = await this.findUserByEmail(email);

      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.FORBIDDEN);
      }

      const user = await this.userModel.create({
        ...createData,
      });

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
}
