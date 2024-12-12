import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  private readonly username = process.env.AUTH_USERNAME;
  private readonly password = process.env.AUTH_PASSWORD;

  validateUser(inputUsername: string, inputPassword: string): boolean {
    if (inputUsername === this.username && inputPassword === this.password) {
      return true;
    }
    return false;
  }
}
