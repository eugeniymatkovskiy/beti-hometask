import { ApiProperty } from '@nestjs/swagger';

export default class UserDTO {
  @ApiProperty({
    type: Number,
  })
  public id: number;

  @ApiProperty({
    type: String,
  })
  public name: string;

  @ApiProperty({
    type: String,
  })
  public email: string;

  @ApiProperty({
    type: String,
  })
  public createdAt: string;

  @ApiProperty({
    type: String,
  })
  public updatedAt: string;
}
