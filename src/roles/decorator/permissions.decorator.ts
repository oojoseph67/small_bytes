import { SetMetadata } from '@nestjs/common';
import { CreatePermissionDto } from '../dto/role.dto';

export const PermissionsMetadataKey = 'permissions';

export const Permissions = (permissions: CreatePermissionDto[]) =>
  SetMetadata(PermissionsMetadataKey, permissions);

/**
 * USAGE
 * @Permissions([{ actions: '', resource: '' }])
 *
 * adding info to the route
 */
