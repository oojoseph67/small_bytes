import {
  Injectable,
  HttpException,
  HttpStatus,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Roles } from './entities/role.entity';
import { Model } from 'mongoose';
import { CreateRoleDto, RoleResponseDto } from './dto/role.dto';
import { plainToInstance } from 'class-transformer';
import { Resource } from './enums/resource.enum';
import { Action } from './enums/action.enum';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectModel(Roles.name)
    private roleModel: Model<Roles>,
  ) {}

  async onModuleInit() {
    await this.seedInitialRoles();
  }

  private async seedInitialRoles() {
    try {
      // Check if roles already exist
      // const existingRoles = await this.roleModel.countDocuments();

      // if (existingRoles > 0) {
      //   console.log('Roles already exist, skipping seeding');
      //   return;
      // }

      const initialRoles = [
        {
          name: 'admin',
          permissions: [
            {
              resource: Resource.ADMIN,
              actions: [
                Action.READ,
                Action.CREATE,
                Action.UPDATE,
                Action.DELETE,
              ],
            },
            {
              resource: Resource.LEARNER,
              actions: [
                Action.READ,
                Action.CREATE,
                Action.UPDATE,
                Action.DELETE,
              ],
            },
            {
              resource: Resource.NEWSLETTER,
              actions: [
                Action.READ,
                Action.CREATE,
                Action.UPDATE,
                Action.DELETE,
              ],
            },
            {
              resource: Resource.ACADEMY,
              actions: [
                Action.READ,
                Action.CREATE,
                Action.UPDATE,
                Action.DELETE,
              ],
            },
            {
              resource: Resource.CERTIFICATE,
              actions: [
                Action.READ,
                Action.CREATE,
                Action.UPDATE,
                Action.DELETE,
              ],
            },
            {
              resource: Resource.LESSON,
              actions: [
                Action.READ,
                Action.CREATE,
                Action.UPDATE,
                Action.DELETE,
              ],
            },
            {
              resource: Resource.QUIZ,
              actions: [
                Action.READ,
                Action.CREATE,
                Action.UPDATE,
                Action.DELETE,
              ],
            },
            {
              resource: Resource.COURSE,
              actions: [
                Action.READ,
                Action.CREATE,
                Action.UPDATE,
                Action.DELETE,
              ],
            },
            {
              resource: Resource.XP,
              actions: [
                Action.READ,
                Action.CREATE,
                Action.UPDATE,
                Action.DELETE,
              ],
            },
            {
              resource: Resource.BLOG,
              actions: [
                Action.READ,
                Action.CREATE,
                Action.UPDATE,
                Action.DELETE,
              ],
            },
          ],
        },
        {
          name: 'learner',
          permissions: [
            {
              resource: Resource.LEARNER,
              actions: [Action.READ, Action.UPDATE],
            },
            {
              resource: Resource.NEWSLETTER,
              actions: [Action.READ, Action.UPDATE],
            },
            {
              resource: Resource.CERTIFICATE,
              actions: [Action.READ],
            },
            {
              resource: Resource.LESSON,
              actions: [Action.READ],
            },
            {
              resource: Resource.COURSE,
              actions: [Action.READ],
            },
            {
              resource: Resource.QUIZ,
              actions: [Action.READ, Action.POST],
            },
            {
              resource: Resource.XP,
              actions: [Action.READ],
            },
          ],
        },
      ];

      // await this.roleModel.insertMany(initialRoles);
      // console.log('Initial roles seeded successfully');

      for (const roleData of initialRoles) {
        await this.upsertRoleWithPermissions(roleData);
      }

      this.logger.log('Role seeding completed');
    } catch (error) {
      this.logger.error('Failed to seed initial roles:', error);
    }
  }

  private async upsertRoleWithPermissions(roleData: {
    name: string;
    permissions: any[];
  }) {
    try {
      // Check if role exists
      let existingRole = await this.roleModel.findOne({ name: roleData.name });

      if (!existingRole) {
        // Create new role if it doesn't exist
        existingRole = await this.roleModel.create(roleData);
        this.logger.log(`Created new role: ${roleData.name}`);
      } else {
        // Role exists, check and update permissions
        let permissionsUpdated = false;
        const updatedPermissions = [...existingRole.permissions];

        for (const newPermission of roleData.permissions) {
          const existingPermissionIndex = updatedPermissions.findIndex(
            (p) => p.resource === newPermission.resource,
          );

          if (existingPermissionIndex === -1) {
            // Permission for this resource doesn't exist, add it
            updatedPermissions.push(newPermission);
            permissionsUpdated = true;
            this.logger.log(
              `Added new permission for resource '${newPermission.resource}' to role '${roleData.name}'`,
            );
          } else {
            // Permission exists, check if we need to add new actions
            const existingPermission =
              updatedPermissions[existingPermissionIndex];
            const newActions = newPermission.actions.filter(
              (action) => !existingPermission.actions.includes(action),
            );

            if (newActions.length > 0) {
              // Add missing actions
              updatedPermissions[existingPermissionIndex] = {
                ...existingPermission,
                actions: [...existingPermission.actions, ...newActions],
              };
              permissionsUpdated = true;
              this.logger.log(
                `Added actions [${newActions.join(', ')}] for resource '${newPermission.resource}' to role '${roleData.name}'`,
              );
            }
          }
        }

        if (permissionsUpdated) {
          // Update the role with new permissions
          await this.roleModel.findByIdAndUpdate(
            existingRole._id,
            { permissions: updatedPermissions },
            { new: true },
          );
          this.logger.log(`Updated permissions for role: ${roleData.name}`);
        } else {
          this.logger.log(
            `Role '${roleData.name}' already has all required permissions`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Failed to upsert role '${roleData.name}':`, error);
    }
  }

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
        plainToInstance(RoleResponseDto, role.toObject()),
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
