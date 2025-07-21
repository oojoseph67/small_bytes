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
import { AccessTokenPayload, TokenResponse } from './type/auth.type';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { nanoid } from 'nanoid';
import { ResetToken } from './entities/reset-token.entity';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,

    @InjectModel(ResetToken.name)
    private resetTokenModel: Model<ResetToken>,

    @Inject(forwardRef(() => HashingProvider))
    private hashingProvider: HashingProvider,

    private usersService: UserService,

    private generateTokenProvider: GenerateTokenProvider,

    private emailService: EmailService,
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

    try {
      // verify the refresh token first
      await this.generateTokenProvider.verifyRefreshToken(refreshToken);

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
      const user = await this.usersService.findUserById(
        token.userId.toString(),
      );

      // generate new token
      return await this.generateUserTokens({ user });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  async logout(userId: string, refreshToken?: string) {
    try {
      if (refreshToken) {
        // Logout from specific session (current refresh token)
        await this.invalidateSpecificSession(refreshToken);
      } else {
        // Logout from all sessions
        await this.invalidateAllUserSessions(userId);
      }
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new HttpException(
        `Error during logout: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: AccessTokenPayload,
  ) {
    const { newPassword, oldPassword } = changePasswordDto;
    const { userId } = user;

    try {
      // find user
      const existingUser = await this.usersService.findUserById(userId);

      if (!existingUser) {
        throw new HttpException(`User doesnt exist`, HttpStatus.BAD_REQUEST);
      }

      // compare old password with new the new password in db
      const { password: oldHashedPassword } = existingUser;
      const isPasswordCorrect = await this.hashingProvider.comparePasswords({
        password: oldPassword,
        hashedPassword: oldHashedPassword,
      });

      if (!isPasswordCorrect) {
        throw new HttpException(
          `Old password doesnt match`,
          HttpStatus.FORBIDDEN,
        );
      }

      // check if new password === oldpassword then throw error
      if (newPassword === oldPassword) {
        throw new HttpException(
          'New password cannot be the same as old password',
          HttpStatus.BAD_REQUEST,
        );
      }

      // hash and change user password
      const newHashedPassword = await this.hashingProvider.hashPassword({
        password: newPassword,
      });

      existingUser.password = newHashedPassword;
      await existingUser.save();

      // Invalidate all existing sessions for this user
      await this.invalidateAllUserSessions(userId);

      return {
        message:
          'Password changed successfully. Please login again with your new password.',
        requiresReauth: true,
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error changing password: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const existingUser = await this.usersService.findUserByEmail(email);

    // FOR SECURITY REASONS IT IS BEST TO NOT THROW AN ERROR. IF THE USER EXISTS WE SEND EMAIL IF THEY DONT WE DONT
    // if (!existingUser) {
    //   throw new HttpException(
    //     `User with email: ${email} does not exist`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    if (existingUser) {
      const resetToken = nanoid(64);
      const { email, _id: userId } = existingUser;

      const existingResetToken = await this.resetTokenModel.findOne({
        userId,
        expiryDate: { $gte: new Date() },
      });

      if (existingResetToken) {
        await this.resetTokenModel.findOneAndDelete({
          _id: existingResetToken._id,
        });
      }

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // expires in an hour

      try {
        await this.resetTokenModel.create({
          token: resetToken,
          userId,
          expiryDate,
        });
      } catch (error) {
        throw new HttpException(
          `Error saving reset token`,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.emailService.sendForgotPasswordEmail({
        to: email,
        token: resetToken,
      });
    }

    return {
      message: `If user with email: ${email} exists, they will receive an email with a verification link attached`,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { newPassword, resetToken } = resetPasswordDto;

    try {
      const codeExist = await this.resetTokenModel.findOne({
        token: resetToken,
      });

      if (!codeExist) {
        throw new HttpException(`Invalid reset token`, HttpStatus.BAD_REQUEST);
      }

      const isCodeExpired = codeExist.expiryDate < new Date();

      if (isCodeExpired) {
        throw new HttpException(
          `Reset token has expired`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.usersService.findUserById(
        codeExist.userId.toString(),
      );

      if (!user) {
        throw new HttpException(`User does not exist`, HttpStatus.BAD_REQUEST);
      }

      const newHashedPassword = await this.hashingProvider.hashPassword({
        password: newPassword,
      });
      user.password = newHashedPassword;
      await user.save();

      await this.resetTokenModel.findOneAndDelete({
        token: resetToken,
      });

      return {
        message: 'Password changed successfully. Login',
        requiresReauth: true,
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error Resetting Password: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
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
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async invalidateAllUserSessions(userId: string) {
    try {
      // Delete all refresh tokens for this user
      await this.refreshTokenModel.deleteMany({
        userId: new Types.ObjectId(userId),
      });
    } catch (error) {
      throw new HttpException(
        `Error invalidating sessions: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async invalidateSpecificSession(refreshToken: string) {
    try {
      // Delete specific refresh token
      await this.refreshTokenModel.findOneAndDelete({
        token: refreshToken,
      });
    } catch (error) {
      throw new HttpException(
        `Error invalidating session: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
