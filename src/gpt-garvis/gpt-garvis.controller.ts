import { Body, Controller, Param, Post } from '@nestjs/common';
import { GptGarvisService } from './gpt-garvis.service';
import { CreateRoomDto } from './dto/room/create-room.dto';
import { EnterRoomDto } from './dto/room/enter-room.dto';
import { Room } from './entities/room.entities';
import { Member } from './entities/member.entities';

@Controller('gpt-garvis')
export class GptGarvisController {
  constructor(private readonly GptGarvisService: GptGarvisService) {}

  @Post('room/create')
  createRoom(@Body() roomData: CreateRoomDto): Promise<Room> {
    return this.GptGarvisService.createRoom(roomData);
  }

  @Post('room/enter/:roomId')
  enterRoom(
    @Param('roomId') roomId: string,
    @Body() userData: EnterRoomDto,
  ): Promise<Member> {
    return this.GptGarvisService.enterRoom(roomId, userData);
  }

  // TODO 일단 지움 GPT 소켓으로 해야할듯
  // @Post('gpt')
  // callGpt(
  //   @Body() gptMessage: EnterRoomDto,
  // ): Promise<Member> {
  //   return this.GptGarvisService.enterRoom(roomId, userData);
  // }

}
