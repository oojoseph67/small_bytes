import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HashingProvider } from './providers/hashing.provider';
import { SignupDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => HashingProvider))
    private hashingProvider: HashingProvider,

    private usersService: UserService,
  ) {}

  async signup(signupData: SignupDto): Promise<UserResponseDto> {
    const { password, name, email } = signupData;

    const hashedPassword = await this.hashingProvider.hashPassword({
      password,
    });

    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
