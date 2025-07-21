export interface SendEmail {
  to: string[];
  subject: string;
  html: string;
}

export interface EmailTemplateResponse {
  html: string;
  subject: string;
}
