import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { BaseController } from "./base.controller";
import { UserService } from "src/application/services/user.service";
import { Public } from "src/infrastructure/decorators/public-api";
import { LoginInput, LoginResult, LogoutInput, RefreshToken, RegisterInput } from "src/application/interfaces/user.interface";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth('access-token')
@ApiTags('user')
@Controller('user')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginInput ): Promise<LoginResult> {
    return await this.userService.login(body);
  }

  @Public()
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: LogoutInput): Promise<void> {
    return await this.userService.logout(body);
  }

  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body:RefreshToken): Promise<{ accessToken: string }> {
    return await this.userService.refreshToken(body.refreshToken);
  }
  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: RegisterInput): Promise<void> {
    return await this.userService.register(body);
  }

  @Public()
  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() email: string): Promise<void> {
    return await this.userService.resetPassword(email);
  }

}