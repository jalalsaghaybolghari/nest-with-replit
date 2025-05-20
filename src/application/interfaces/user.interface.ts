import { ApiProperty } from "@nestjs/swagger";

export class LoginInput {
  @ApiProperty({ example: 'john.doe@gmail.com' })
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  password: string;
}
export class RegisterInput {
  @ApiProperty({ example: 'john.doe@gmail.com' })
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  password: string;
}
export class LoginResult {
  @ApiProperty({ example: 'access-token-123' })
  accessToken: string;

  @ApiProperty({ example: 'refresh-token-456' })
  refreshToken: string;

  @ApiProperty({ example: 'user-id-789' })
  userId: string;

  @ApiProperty({ example: 'john.doe@gmail.com' })
  email: string;
}
export class LogoutInput {
  @ApiProperty({ example: '6819ba25cc5342b482960302' })
  userId: string;

  @ApiProperty({ example: 'access-token-123' })
  accessToken: string;

  @ApiProperty({ example: 'refresh-token-456' })
  refreshToken: string;
}

export class RefreshToken {
  @ApiProperty({ example: 'refresh-token-456' })
  refreshToken: string;
}

