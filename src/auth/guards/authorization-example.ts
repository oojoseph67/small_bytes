// /**
//  * AUTHORIZATION GUARD USAGE EXAMPLES
//  * 
//  * This file demonstrates how to use the AuthorizationGuard with different
//  * permission scenarios in your NestJS controllers.
//  */

// import { Controller, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
// import { AuthenticationGuard } from './authentication.guard';
// import { AuthorizationGuard } from './authorization.guard';
// import { Permissions } from 'src/roles/decorator/permissions.decorator';
// import { Resource } from 'src/roles/enums/resource.enum';
// import { Action } from 'src/roles/enums/action.enum';

// /**
//  * EXAMPLE 1: Basic User Management Controller
//  * Shows different permission levels for user operations
//  */
// @Controller('users')
// @UseGuards(AuthenticationGuard, AuthorizationGuard) // Always use AuthenticationGuard first
// export class UserController {
  
//   // Read-only access to users
//   @Get()
//   @Permissions([{ resource: Resource.USERS, actions: [Action.READ] }])
//   findAll() {
//     return { message: 'List all users' };
//   }

//   // Create new users
//   @Post()
//   @Permissions([{ resource: Resource.USERS, actions: [Action.CREATE] }])
//   create() {
//     return { message: 'Create new user' };
//   }

//   // Update existing users
//   @Put(':id')
//   @Permissions([{ resource: Resource.USERS, actions: [Action.UPDATE] }])
//   update() {
//     return { message: 'Update user' };
//   }

//   // Delete users
//   @Delete(':id')
//   @Permissions([{ resource: Resource.USERS, actions: [Action.DELETE] }])
//   delete() {
//     return { message: 'Delete user' };
//   }

//   // Multiple actions on same resource
//   @Get('profile')
//   @Permissions([{ resource: Resource.USERS, actions: [Action.READ, Action.UPDATE] }])
//   getProfile() {
//     return { message: 'User profile (requires read AND update permissions)' };
//   }
// }

// /**
//  * EXAMPLE 2: Admin Controller with Multiple Resources
//  * Shows how to handle multiple resource permissions
//  */
// @Controller('admin')
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
// export class AdminController {
  
//   // Access to settings
//   @Get('settings')
//   @Permissions([{ resource: Resource.SETTINGS, actions: [Action.READ] }])
//   getSettings() {
//     return { message: 'Get system settings' };
//   }

//   // Manage roles
//   @Get('roles')
//   @Permissions([{ resource: Resource.ROLES, actions: [Action.READ] }])
//   getRoles() {
//     return { message: 'List all roles' };
//   }

//   // Create new roles
//   @Post('roles')
//   @Permissions([{ resource: Resource.ROLES, actions: [Action.CREATE] }])
//   createRole() {
//     return { message: 'Create new role' };
//   }

//   // Full CRUD on products
//   @Get('products')
//   @Permissions([{ resource: Resource.PRODUCTS, actions: [Action.READ] }])
//   getProducts() {
//     return { message: 'List products' };
//   }

//   @Post('products')
//   @Permissions([{ resource: Resource.PRODUCTS, actions: [Action.CREATE] }])
//   createProduct() {
//     return { message: 'Create product' };
//   }

//   @Put('products/:id')
//   @Permissions([{ resource: Resource.PRODUCTS, actions: [Action.UPDATE] }])
//   updateProduct() {
//     return { message: 'Update product' };
//   }

//   @Delete('products/:id')
//   @Permissions([{ resource: Resource.PRODUCTS, actions: [Action.DELETE] }])
//   deleteProduct() {
//     return { message: 'Delete product' };
//   }
// }

// /**
//  * EXAMPLE 3: Route without Permissions
//  * Routes without @Permissions decorator are accessible to all authenticated users
//  */
// @Controller('public')
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
// export class PublicController {
  
//   // No permissions required - any authenticated user can access
//   @Get('info')
//   getPublicInfo() {
//     return { message: 'Public information for authenticated users' };
//   }

//   // This route requires specific permissions
//   @Get('admin-info')
//   @Permissions([{ resource: Resource.SETTINGS, actions: [Action.READ] }])
//   getAdminInfo() {
//     return { message: 'Admin-only information' };
//   }
// }

// /**
//  * PERMISSION SCENARIOS:
//  * 
//  * 1. USER WITH READ PERMISSION ON USERS:
//  *    - ✅ Can access GET /users
//  *    - ❌ Cannot access POST /users (needs CREATE permission)
//  *    - ❌ Cannot access PUT /users/:id (needs UPDATE permission)
//  * 
//  * 2. USER WITH READ + CREATE PERMISSIONS ON USERS:
//  *    - ✅ Can access GET /users
//  *    - ✅ Can access POST /users
//  *    - ❌ Cannot access PUT /users/:id (needs UPDATE permission)
//  * 
//  * 3. ADMIN WITH ALL PERMISSIONS:
//  *    - ✅ Can access all routes
//  * 
//  * 4. USER WITH NO PERMISSIONS:
//  *    - ❌ Cannot access any protected routes
//  *    - ✅ Can access routes without @Permissions decorator
//  * 
//  * ROLE EXAMPLES:
//  * 
//  * User Role:
//  * - users: [read]
//  * - products: [read]
//  * 
//  * Moderator Role:
//  * - users: [read, update]
//  * - products: [read, create, update]
//  * 
//  * Admin Role:
//  * - users: [read, create, update, delete]
//  * - products: [read, create, update, delete]
//  * - roles: [read, create, update, delete]
//  * - settings: [read, update]
//  */ 