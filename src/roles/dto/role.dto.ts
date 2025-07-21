import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsEnum,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

export class CreatePermissionDto {
  @IsEnum(Resource)
  resource: Resource;

  @IsArray()
  @IsEnum(Action, { each: true })
  @ArrayUnique()
  actions: Action[];
}

export class PermissionResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  _id: string;

  @Expose()
  resource: Resource;

  @Expose()
  actions: Action[];
}

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePermissionDto)
  permissions: CreatePermissionDto[];
}

export class RoleResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString())
  _id: string;

  @Expose()
  name: string;

  @Expose()
  @Type(() => PermissionResponseDto)
  permissions: PermissionResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  __v: number;
}
