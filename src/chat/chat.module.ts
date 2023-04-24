import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RoomModule } from './room/room.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat'),
    RoomModule,
    MemberModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
