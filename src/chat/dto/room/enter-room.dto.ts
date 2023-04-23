import { IsNotEmpty, IsString } from 'class-validator';

export class EnterRoomDto {
  @IsString()
  @IsNotEmpty()
  memberName: string;
}
