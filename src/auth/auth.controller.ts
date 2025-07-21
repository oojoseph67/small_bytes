import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }
}

/**
 * ACCESS TOKEN & REFRESH TOKEN FLOW:
 *
 * 1. ACCESS TOKEN: Short-lived token (usually 15-60 minutes) used for API authentication
 *    - Sent with every API request in Authorization header
 *    - Contains user identity and permissions
 *    - When expired, API returns 401 Unauthorized
 *
 * 2. REFRESH TOKEN: Long-lived token (usually 7-30 days) used to get new access tokens
 *    - Stored securely (httpOnly cookie or secure storage)
 *    - Not sent with every request
 *    - Used only when access token expires
 *
 * 3. FRONTEND REFRESH LOGIC:
 *    - When API returns 401, frontend should:
 *      a) Call /auth/refresh with the refresh token
 *      b) Get new access token and refresh token
 *      c) Retry the original failed request
 *    - If refresh fails (refresh token expired), redirect to login
 *
 * 4. SECURITY: Refresh tokens are rotated on each use to prevent token reuse attacks
 */
