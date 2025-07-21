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
        'No token passed. Pass AccessToken',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = await this.generateTokenProvider.verifyAccessToken(token);

    request[REQUEST_USER_KEY] = payload;

    return true;
  }
}

/**
 * THIS GUARD MAKE SURE THAT ANYONE MAKING A REQUEST TO ANY OF OUR ENDPOINT PASSES A LEGIT ACCESS_TOKEN
 */
