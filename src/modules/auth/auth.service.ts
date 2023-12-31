import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersRepository } from 'src/shared/database/repositories/users.repository';

import { compare, hash } from 'bcryptjs';

import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  private async generateAccessToken(userId: string) {
    return await this.jwtService.signAsync({ sub: userId });
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const user = await this.usersRepository.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAccessToken(user.id);

    return {
      accessToken,
    };
  }

  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;

    const emailAlreadyInUse = await this.usersRepository.findUnique({
      where: {
        email,
      },
    });

    if (emailAlreadyInUse) {
      throw new ConflictException('This email is already in use');
    }

    const hashedPassword = await hash(password, 12);

    const user = await this.usersRepository.create({
      data: {
        name,
        email,
        password: hashedPassword,
        categories: {
          createMany: {
            data: [
              { name: 'Salário', icon: 'salary', type: 'INCOME' },
              { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
              { name: 'Outro', icon: 'other', type: 'INCOME' },
              { name: 'Casa', icon: 'home', type: 'EXPENSE' },
              { name: 'Alimentação', icon: 'food', type: 'EXPENSE' },
              { name: 'Educação', icon: 'education', type: 'EXPENSE' },
              { name: 'Lazer', icon: 'fun', type: 'EXPENSE' },
              { name: 'Mercado', icon: 'grocery', type: 'EXPENSE' },
              { name: 'Roupas', icon: 'clothes', type: 'EXPENSE' },
              { name: 'Transporte', icon: 'transport', type: 'EXPENSE' },
              { name: 'Viagem', icon: 'travel', type: 'EXPENSE' },
              { name: 'Outro', icon: 'other', type: 'EXPENSE' },
            ],
          },
        },
      },
    });

    const accessToken = await this.generateAccessToken(user.id);

    return {
      accessToken,
    };
  }
}
