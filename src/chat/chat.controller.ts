import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/room/create-room.dto';
import { EnterRoomDto } from './dto/room/enter-room.dto';
import { Room } from './entities/room.entities';
import { Member } from './entities/member.entities';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('room/create')
  createRoom(@Body() roomData: CreateRoomDto): Room {
    return this.chatService.create(roomData);
  }

  @Get('room/enter/:roomId')
  enterRoom(
    @Param('roomId') roomId: string,
    @Body() userData: EnterRoomDto,
  ): Member {
    return this.chatService.enterRoom(roomId, userData);
  }
}
