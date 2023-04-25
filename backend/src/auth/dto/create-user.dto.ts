import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';

export default class CreateUserDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, {
    message: 'Name is too long',
  })
  public name: string;

  @ApiProperty({
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
