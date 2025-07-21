import { User } from 'src/user/entities/user.entity';

// Type definitions for better type safety
export interface BaseTokenPayload {
  userId: string;
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
  userId: string;
  expiresIn: number;
  payload?: Omit<T, 'userId' | 'iat' | 'exp'>;
}

export interface GenerateTokensParams {
  user: User;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
