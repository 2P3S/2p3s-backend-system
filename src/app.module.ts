import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ScrumDiceModule } from './scrum-dice/scrum-dice.module';
import { GptGarvisModule } from './gpt-garvis/gpt-garvis.module'; 
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat', {
      connectionName: 'chat',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/scrum-dice', {
      connectionName: 'scrum-dice',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/gpt-garvis', {
      connectionName: 'gpt-garvis',
    }),
    ChatModule,
    ScrumDiceModule,
    GptGarvisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
