import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ScrumDiceService } from './scrum-dice.service';
import { CreateRoomDto } from './dto/room/create-room.dto';
import { EnterRoomDto } from './dto/room/enter-room.dto';
import { Room } from './entities/room.entities';
import { Member } from './entities/member.entities';

@Controller('scrum-dice')
export class ScrumDiceController {
  constructor(private readonly scrumDiceService: ScrumDiceService) {}

  @Post('room/create')
  createRoom(@Body() roomData: CreateRoomDto): Promise<Room> {
    return this.scrumDiceService.createRoom(roomData);
  }

  @Post('room/enter/:roomId')
  enterRoom(
    @Param('roomId') roomId: string,
    @Body() userData: EnterRoomDto,
  ): Promise<Member> {
    return this.scrumDiceService.enterRoom(roomId, userData);
  }
}
