import { registerAs } from '@nestjs/config';

export default registerAs('doc', () => ({
  name: process.env.APP_NAME || 'Files Service API',
  description: 'The Files Service API description',
  version: '1.0',
  prefix: 'docs',
}));
