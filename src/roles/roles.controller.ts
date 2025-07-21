import { Body, Controller, Post, Get, UseInterceptors } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/role.dto';

@Controller('roles')
@UseInterceptors(ClassSerializerInterceptor)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto){
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  async getAllRole() {
    return this.rolesService.getAllRoles();
  }
}
