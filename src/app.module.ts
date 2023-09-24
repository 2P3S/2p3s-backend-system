import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ScrumDiceModule } from './scrum-dice/scrum-dice.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.CHAT_MONGO_URL, {
      connectionName: 'chat',
    }),
    MongooseModule.forRoot(process.env.SCRUM_DICE_MONGO_URL, {
      connectionName: 'scrum-dice',
    }),
    ChatModule,
    ScrumDiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure() {
    const isDev = process.env.NODE_ENV === 'development';
    mongoose.set('debug', isDev);
  }
}
