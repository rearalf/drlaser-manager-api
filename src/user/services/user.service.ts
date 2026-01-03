import { ConflictException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { CreateUserDto } from '../dto/create-user.dto';

import { User } from '../entities/user.entity';

import { UserRoleService } from './user-role.service';

@Injectable()
export class UserService {
  constructor(private readonly userRoleService: UserRoleService) {}

  async createWithEntity(
    manager: EntityManager,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const emailValidation = await manager.findOneBy(User, {
      email: createUserDto.email,
    });

    if (emailValidation)
      throw new ConflictException(
        `El correo ${createUserDto.email} ya está registrado`,
      );

    const createUser = manager.create(User, {
      password: createUserDto.password,
      email: createUserDto.email,
    });

    const savedUser = await manager.save(User, createUser);

    const _createUserRole = await this.userRoleService.create(
      manager,
      savedUser.id,
      createUserDto.role_ids,
    );

    return savedUser;
  }

  create(_createUserDto: CreateUserDto): string {
    return 'This action adds a new user';
  }

  findAll(): string {
    return `This action returns all user`;
  }

  findOne(id: number): string {
    return `This action returns a #${id} user`;
  }

  //   update(id: number, _updateUserDto: UpdateUserDto): string {
  //     return `This action updates a #${id} user`;
  //   }

  remove(id: number): string {
    return `This action removes a #${id} user`;
  }
}
