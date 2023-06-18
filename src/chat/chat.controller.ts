import { Body, Controller, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/room/create-room.dto';
import { EnterRoomDto } from './dto/room/enter-room.dto';
import { Room } from './entities/room.entities';
import { Member } from './entities/member.entities';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('room/create')
  createRoom(@Body() roomData: CreateRoomDto): Promise<Room> {
    return this.chatService.createRoom(roomData);
  }

  @Post('room/enter/:roomId')
  enterRoom(
    @Param('roomId') roomId: string,
    @Body() userData: EnterRoomDto,
  ): Promise<Member> {
    return this.chatService.enterRoom(roomId, userData);
  }
}
