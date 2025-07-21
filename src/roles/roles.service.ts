import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Roles } from './entities/role.entity';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles.name)
    private roleModel: Model<Roles>,
  ) {}

  async createRole(role: CreateRoleDto): Promise<Roles> {
    try {
      const existingRole = await this.roleModel.findOne({ name: role.name });

      if (existingRole) {
        throw new HttpException(
          `Role with name '${role.name}' already exists`,
          HttpStatus.CONFLICT,
        );
      }

      const newRole = await this.roleModel.create(role);

      return newRole;
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

  async getRoleById(roleId: string): Promise<Roles> {
    try {
      const role = await this.roleModel.findById(roleId);

      if (!role) {
        throw new HttpException(
          `Role with ID '${roleId}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return role;
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

  async getAllRoles(): Promise<Roles[]> {
    try {
      const role = await this.roleModel.find().exec();

      return role;
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
