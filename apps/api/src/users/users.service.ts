import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async create(dto: CreateUserDto): Promise<User> {
    const existing = this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user: User = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      passwordHash,
      createdAt: new Date(),
    };

    this.users.push(user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }
}
