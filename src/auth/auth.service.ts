import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async login(loginDto: LoginDto) {
    const adminEmail =
      this.configService.get<string>('ADMIN_EMAIL') || 'admin@hiverift.com';
    const adminPass =
      this.configService.get<string>('ADMIN_PASS') || 'admin123';

    const inputEmail = loginDto.email.trim().toLowerCase();
    const inputPass = loginDto.password;

    if (inputEmail !== adminEmail.toLowerCase() || inputPass !== adminPass) {
      throw new UnauthorizedException(
        'Invalid email or password. Please check your credentials.',
      );
    }

    const token = `hiverift-admin-token-${uuidv4()}`;

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        email: adminEmail,
        name: 'HiveRift Administrator',
        role: 'Super Admin',
      },
    };
  }
}
