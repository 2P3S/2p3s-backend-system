import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ScrumDiceModule } from './scrum-dice/scrum-dice.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.CHAT_MONGO_ID}:${process.env.CHAT_MONGO_PASSWORD}@${process.env.CHAT_MONGO_URL}`,
      {
        connectionName: 'chat',
      },
    ),
    MongooseModule.forRoot(
      `mongodb://${process.env.SCRUM_DICE_MONGO_ID}:${process.env.SCRUM_DICE_MONGO_PASSWORD}@${process.env.SCRUM_DICE_MONGO_URL}`,
      {
        connectionName: 'scrum-dice',
      },
    ),
    ChatModule,
    ScrumDiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
