import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Roles } from './entities/role.entity';
import { Model } from 'mongoose';
import { CreateRoleDto, RoleResponseDto } from './dto/role.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name)
    private roleModel: Model<Roles>,
  ) {}

  async createRole(role: CreateRoleDto) {
    try {
      const existingRole = await this.roleModel.findOne({ name: role.name });

      if (existingRole) {
        throw new HttpException(
          `Role with name '${role.name}' already exists`,
          HttpStatus.CONFLICT,
        );
      }

      const newRole = await this.roleModel.create(role);

      return plainToInstance(RoleResponseDto, newRole.toObject());
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to create role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllRoles() {
    try {
      const roles = await this.roleModel.find().exec();

      return roles.map((role) => 
        plainToInstance(RoleResponseDto, role.toObject())
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to retrieve roles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRoleById(roleId: string) {
    try {
      const role = await this.roleModel.findById(roleId);

      if (!role) {
        throw new HttpException(
          `Role with ID '${roleId}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return plainToInstance(RoleResponseDto, role.toObject());
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to retrieve role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRoleByName(name: string) {
    try {
      const role = await this.roleModel.findOne({
        name,
      });

      if (!role) {
        throw new HttpException(
          `Role with name '${name}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return plainToInstance(RoleResponseDto, role.toObject());
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to retrieve role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
