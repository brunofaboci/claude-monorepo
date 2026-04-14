import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'João Silva' })
  name!: string;

  @ApiProperty({ example: 'joao@exemplo.com' })
  email!: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt!: Date;
}

export function toUserResponse(user: User): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}
