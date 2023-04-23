import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoomDto, EnterRoomDto } from './dto/room';
import { ChatService } from './chat.service';
import { Member, Room } from './entities/chat';

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
