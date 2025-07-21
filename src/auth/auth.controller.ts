import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { AuthGuard } from './guards/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LogoutDto } from './dto/logout.dto';

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

  @UseGuards(AuthGuard)
  @Get('demo')
  demo(@Req() req) {
    console.log({ user: req.user });
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req, @Body() logoutDto?: LogoutDto) {
    const user = req.user;
    return this.authService.logout(user.userId, logoutDto?.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = req.user;
    return this.authService.changePassword(changePasswordDto, user);
  }

  async forgotPassword() {}

  async resetPassword() {}
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
 * 4. SECURITY FEATURES:
 *    - Refresh tokens are rotated on each use to prevent token reuse attacks
 *    - Password change invalidates ALL existing sessions (forces re-login)
 *    - Logout can invalidate specific session or all sessions
 *    - JWT tokens are verified on every protected request
 */

// example frontend handling change password
// const changePassword = async (oldPassword, newPassword) => {
//   const response = await api.post('/auth/change-password', {
//     oldPassword,
//     newPassword
//   });
  
//   if (response.data.requiresReauth) {
//     // Clear local tokens
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
    
//     // Redirect to login
//     router.push('/login');
    
//     // Show message
//     showMessage('Password changed! Please login with your new password.');
//   }
// };
