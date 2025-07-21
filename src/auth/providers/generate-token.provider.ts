import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import {
  AccessTokenPayload,
  BaseTokenPayload,
  CreateTokenParams,
  GenerateTokensParams,
  RefreshTokenPayload,
  TokenResponse,
} from '../type/auth.type';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    // injecting jwt service dependency
    private jwtService: JwtService,

    // injecting jwtConfig (environment values)
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  private async createToken<T extends BaseTokenPayload>({
    userId,
    expiresIn,
    payload,
  }: CreateTokenParams<T>): Promise<string> {
    // generate jwt(refresh) token for authenticated user
    const signToken = await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      } as T,
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
  }: GenerateTokensParams): Promise<TokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.createToken<AccessTokenPayload>({
        expiresIn: this.jwtConfiguration.jwtTokenExpiration,
        userId: user._id as number,
        payload: {
          email: user.email,
        },
      }),

      this.createToken<RefreshTokenPayload>({
        expiresIn: this.jwtConfiguration.jwtRefreshTokenExpiration,
        userId: user._id as number,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async verifyTokens(
    token: string,
  ): Promise<RefreshTokenPayload | AccessTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.jwtSecret,
      });
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }

  public async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const payload = await this.verifyTokens(token);
    
    // Type guard to ensure it's an AccessTokenPayload
    if ('email' in payload) {
      return payload as AccessTokenPayload;
    }
    
    throw new HttpException('Invalid access token', HttpStatus.UNAUTHORIZED);
  }

  public async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    const payload = await this.verifyTokens(token);
    
    // Type guard to ensure it's a RefreshTokenPayload
    if (!('email' in payload)) {
      return payload as RefreshTokenPayload;
    }
    
    throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
  }
}
