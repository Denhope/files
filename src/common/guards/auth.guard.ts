import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      // Временно для тестирования добавляем моковые данные пользователя
      request.user = {
        id: 1,
        email: 'test@example.com',
        role: 'user'
      };
      return true;
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`, error.stack);
      throw new UnauthorizedException('Authentication failed');
    }
  }
} 