import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    jwtSecret: process.env.JWT_SECRET,
    jwtTokenAudience: process.env.JWT_TOKEN_AUDIENCE,
    jwtTokenIssuer: process.env.JWT_TOKEN_ISSUER,
    jwtTokenExpiration: parseInt(process.env.JWT_ACCESS_TOKEN_TIME_TO_LIVE),
    jwtRefreshTokenExpiration: parseInt(
      process.env.JWT_REFRESH_TOKEN_TIME_TO_LIVE,
    ),
  };
});
