import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GenerateTokenProvider } from '../providers/generate-token.provider';
import { Request } from 'express';
import { AccessTokenPayload } from '../type/auth.type';

export const REQUEST_USER_KEY = 'user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private generateTokenProvider: GenerateTokenProvider) {}

  private extractRequestFromHeader({ request }: { request: Request }) {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractRequestFromHeader({ request });

    if (!token) {
      throw new HttpException(
        'No token passed. Login to pass accessToken',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = await this.generateTokenProvider.verifyAccessToken(token);

    request[REQUEST_USER_KEY] = payload;

    return true;
  }
}

/**
 * A Guard in NestJS acts like a security checkpoint that runs before your route handlers.
 * It can either allow the request to proceed or block it entirely.
 *
 * This AuthGuard specifically:
 * 1. Extracts the JWT access token from the Authorization header
 * 2. Verifies the token is valid and not expired
 * 3. Decodes the user information from the token
 * 4. Attaches the user data to the request object for use in controllers
 * 5. Blocks requests that don't have a valid token
 */
