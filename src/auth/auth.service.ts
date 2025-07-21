import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { HashingProvider } from './providers/hashing.provider';
import { SignupDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { GenerateTokenProvider } from './providers/generate-token.provider';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './entities/auth.entity';
import { Model, Types } from 'mongoose';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { User } from 'src/user/entities/user.entity';
import { TokenResponse } from './type/auth.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,

    @Inject(forwardRef(() => HashingProvider))
    private hashingProvider: HashingProvider,

    private usersService: UserService,

    private generateTokenProvider: GenerateTokenProvider,
  ) {}

  async signup(signupDto: SignupDto): Promise<UserResponseDto> {
    const { password, name, email } = signupDto;

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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new HttpException(
        `User with Email: ${email} not found`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordCorrect = await this.hashingProvider.comparePasswords({
      password,
      hashedPassword: user.password,
    });

    if (!isPasswordCorrect) {
      throw new HttpException(`Incorrect Password`, HttpStatus.UNAUTHORIZED);
    }

    await this.findAndDeleteRefreshToken(user._id as Types.ObjectId);
    const { accessToken, refreshToken } = await this.generateUserTokens({
      user,
    });

    return {
      accessToken, // main token
      refreshToken, // used to create a new access token when it expires
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    const token = await this.refreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new HttpException(
        'Please login. Invalid Refresh Token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.findAndDeleteRefreshToken(token.userId);
    const user = await this.usersService.findUserById(token.userId.toString());

    // generate new token
    return await this.generateUserTokens({ user });
  }

  private async generateUserTokens({
    user,
  }: {
    user: User;
  }): Promise<TokenResponse> {
    const jwtTokens = await this.generateTokenProvider.generateTokens({ user });
    await this.storeRefreshToken({
      refreshToken: jwtTokens.refreshToken,
      userId: user._id as Types.ObjectId,
    });

    return jwtTokens;
  }

  private async storeRefreshToken({
    refreshToken,
    userId,
  }: {
    refreshToken: string;
    userId: Types.ObjectId;
  }) {
    try {
      const refreshTokenPayload =
        await this.generateTokenProvider.verifyRefreshToken(refreshToken);
      const date = new Date(refreshTokenPayload.exp * 1000);

      this.refreshTokenModel.create({
        token: refreshToken,
        userId: userId,
        expiryDate: date,
      });
    } catch {
      throw new HttpException(
        `Error saving refresh token`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async findAndDeleteRefreshToken(id: Types.ObjectId) {
    try {
      return await this.refreshTokenModel.findOneAndDelete({
        userId: id,
      });
    } catch (error) {
      throw new HttpException(
        `Error deleting refresh token : ${error.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
