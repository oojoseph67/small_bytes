import { registerAs } from '@nestjs/config';

export default registerAs('resend', () => {
  return {
    resendApiKey: process.env.RESEND_API_KEY,
    resendFromEmail: process.env.RESEND_FROM_EMAIL,
  };
});
