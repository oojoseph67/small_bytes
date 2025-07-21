import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    // injecting jwt service dependency
    private jwtService: JwtService,

    // injecting jwtConfig (environment values)
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  private async createToken<T>({
    userId,
    expiresIn,
    payload,
  }: {
    userId: number;
    expiresIn: number;
    payload?: T;
  }) {
    // generate jwt(refresh) token for authenticated user
    const signToken = await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        expiresIn: expiresIn,
        secret: this.jwtConfiguration.jwtSecret,
        audience: this.jwtConfiguration.jwtTokenAudience,
        issuer: this.jwtConfiguration.jwtTokenIssuer,
      },
    );

    return signToken;
  }

  /**
   * generateTokens
   */
  public async generateTokens({
    user,
  }: {
    // user: Omit<UserPayload, 'iat' | 'exp' | 'aud' | 'iss'>;
    user: User;
  }) {
    const [accessToken, refreshToken] = await Promise.all([
      await this.createToken({
        expiresIn: this.jwtConfiguration.jwtTokenExpiration,
        userId: user._id as number,
        payload: {
          email: user.email,
        },
      }),

      await this.createToken({
        expiresIn: this.jwtConfiguration.jwtRefreshTokenExpiration,
        userId: user.id,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
