import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMemberDto {
  @IsString()
  @IsNotEmpty()
  readonly memberId: string;
}
