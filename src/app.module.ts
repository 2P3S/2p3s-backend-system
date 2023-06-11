import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ScrumDiceModule } from './scrum-dice/scrum-dice.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat', {
      connectionName: 'chat',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/scrum-dice', {
      connectionName: 'scrum-dice',
    }),
    ChatModule,
    ScrumDiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
