import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { Deck } from 'src/scrum-dice/entities/room.entities';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  readonly roomName: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['FIBONACCI_NUMBERS', 'MODIFIED_FIBONACCI_NUMBERS'])
  readonly deckType: Deck;
}
