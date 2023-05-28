import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrumDiceController } from './scrum-dice.controller';
import { ScrumDiceService } from './scrum-dice.service';
import { RoomModule } from './room/room.module';
import { MemberModule } from './member/member.module';
import { ScrumDiceGateway } from './scrum-dice.gateway';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat'),
    RoomModule,
    MemberModule,
  ],
  controllers: [ScrumDiceController],
  providers: [ScrumDiceService, ScrumDiceGateway],
})
export class ScrumDiceModule {}
