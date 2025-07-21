import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { Permissions } from './roles/decorator/permissions.decorator';
import { Resource } from './roles/enums/resource.enum';
import { Action } from './roles/enums/action.enum';
import { AuthorizationGuard } from './auth/guards/authorization.guard';

@UseGuards(AuthenticationGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthorizationGuard)
  @Permissions([{ actions: [Action.READ], resource: Resource.ROLES }])
  @Get()
  getHello(@Req() req): string {
    const user = req.user;
    return this.appService.getHello();
  }
}

/**
 * RESOURCE === route type
 * ACTIONS === HTTP action
 */
