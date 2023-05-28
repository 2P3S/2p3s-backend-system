import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ScrumDiceModule } from './scrum-dice/scrum-dice.module';

@Module({
  imports: [ChatModule, ScrumDiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
