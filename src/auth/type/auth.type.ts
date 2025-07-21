import { User } from 'src/user/entities/user.entity';

// Type definitions for better type safety
export interface BaseTokenPayload {
  sub: number;
  iat: number;
  exp: number;
}

export interface AccessTokenPayload extends BaseTokenPayload {
  email: string;
}

export interface RefreshTokenPayload extends BaseTokenPayload {
  // Refresh tokens typically only need the user ID
}

export interface CreateTokenParams<T = BaseTokenPayload> {
  userId: number;
  expiresIn: number;
  payload?: Omit<T, 'sub' | 'iat' | 'exp'>;
}

export interface GenerateTokensParams {
  user: User;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
