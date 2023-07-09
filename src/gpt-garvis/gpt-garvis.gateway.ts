import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Namespace, Socket } from 'socket.io';
import { RoomService } from './room/room.service';
import { MemberService } from './member/member.service';
import { Room } from './entities/room.entities';
import { Member } from './entities/member.entities';
import axios from 'axios'

const HELP_MESSAGE = `
명령어 목록:
/gpt <message> - GPT-4에 메시지를 전송하고 응답을 받습니다.
/otherCommand - 다른 명령어의 설명...
`;

type EventNames =
  | 'join-success'
  | 'member-connected'
  | 'member-disconnected'
  | 'message'
  | 'command-help'
  | 'command-gpt';
const MESSAGES: { [eventName in EventNames]: string } = {
  'join-success': '방 입장에 성공했습니다.',
  'member-connected': '사용자가 입장했습니다.',
  'member-disconnected': '사용자가 나갔습니다.',
  message: '메시지를 전송했습니다.',
  'command-help' : '커맨드 설명을 요청했습니다.',
  'command-gpt' : '커맨드로 GPT API를 요청했습니다.',
};

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: 'gpt-garvis',
})
export class GptGarvisGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(GptGarvisGateway.name);
  @WebSocketServer()
  private namespace: Namespace;
  private apiKey: string;

  // 각 명령어에 대한 처리 함수들을 가진 객체를 정의합니다.
  private commandHandlers = {
    '/gpt': async (message: string) => {
      const gptInput = message.slice('/gpt'.length).trim();
      try {
        const gptResponse = await this.sendToGPT(gptInput);
        const gptMessage = gptResponse.data.choices[0].text;
        return { command: 'command-gpt', result: gptMessage };
      } catch (error) {
        throw new Error(`GPT-4 요청 실패: ${error}`);
      }
    },
    // 추가로 다른 명령어들을 여기에 추가할 수 있습니다.
    // '/otherCommand': async (message) => { /* ... */ },
  };

  constructor(
    private readonly roomManager: RoomService,
    private readonly memberManager: MemberService,
  ) {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  afterInit() {
    this.logger.log('웹소켓 서버 초기화 🤩');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`✅ ${socket.id} 소켓 연결 성공`);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`❌ ${socket.id} 소켓 연결 해제`);
    const member = await this.checkSocket(socket.id);
    this.sendToRoom(socket, 'member-disconnected', member.room.toString(), {
      member,
    });
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { roomId: string; memberId: string },
  ) {
    this.checkSocketBody(body.roomId, body.memberId)
      .then((data) => this.sendMessage(socket, 'join-success', data))
      .catch((err) => this.sendFailure(socket, err.message));
  }

  @SubscribeMessage('join-request')
  async handleJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { roomId: string; memberId: string },
  ) {
    this.checkSocketBody(body.roomId, body.memberId)
      .then((data) =>
        this.sendToRoom(socket, 'member-connected', body.roomId, data),
      )
      .catch((err) => this.sendFailure(socket, err.message));
  }

@SubscribeMessage('message')
async handleMessage(
  @ConnectedSocket() socket: Socket,
  @MessageBody() body: { roomId: string; memberId: string; message: string },
) {
  const command = body.message.split(' ')[0].toLowerCase(); // 명령어를 소문자로 변경하여 처리합니다.

  if (command.startsWith('/')) {
    // 명령어 형식이 맞는 경우
    const commandName = command.slice(1); // 명령어에서 `/` 제거

    if (commandName in this.commandHandlers) {
      // 명령어가 commandHandlers에 정의되어 있는 경우
      try {
        const result = await this.commandHandlers[commandName];
        this.sendToRoom(socket, result.command, body.roomId, { message: result.result });
      } catch (error) {
        this.sendFailure(socket, error.message);
      }
    } else {
      // 명령어가 정의되지 않은 경우
      this.sendToRoom(socket, 'command-help', body.roomId, { message: HELP_MESSAGE });
    }
  } else {
    // 일반 메시지로 처리
    this.checkSocketBody(body.roomId, body.memberId)
      .then((data) => this.sendToRoom(socket, 'message', body.roomId, data))
      .catch((err) => this.sendFailure(socket, err.message));
  }
}
  private async checkSocketBody(
    roomId: string,
    memberId: string,
  ): Promise<{ room: Room; member: Member }> {
    const room = await this.checkRoom(roomId);
    const member = await this.checkMember(memberId);

    if (member.room.valueOf() !== room.id) {
      throw new WsException('방에 속하지 않은 사용자입니다.');
    }

    return { room, member };
  }

  private async checkRoom(roomId) {
    const room = await this.roomManager.getRoom(roomId);
    if (!room) {
      throw new WsException('존재하지 않는 방입니다.');
    }
    return room;
  }

  private async checkMember(roomId) {
    const member = await this.memberManager.getMember(roomId);
    if (!member) {
      throw new WsException('존재하지 않는 사용자입니다.');
    }
    return member;
  }

  private async checkSocket(socketId) {
    const member = await this.memberManager.updateMemberDisconnected(socketId);
    if (!member) {
      this.logger.error('소켓 연결 종료 실패', socketId);
    }
    return member;
  }

  private sendMessage(client: Socket, eventName: EventNames, data: object) {
    client.emit(eventName, {
      success: true,
      message: MESSAGES[eventName],
      data,
    });
  }

  private sendToRoom(
    client: Socket,
    eventName: EventNames,
    roomId: string,
    data: object,
  ) {
    client.to(roomId).emit(eventName, {
      success: true,
      message: MESSAGES[eventName],
      data,
    });
  }

  private async sendToGPT(input: string): Promise<any> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          prompt: input,
          max_tokens: 60,
          model: "gpt-3.5-turbo"
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`, // 실제 GPT API 키로 대체해주세요
            'Content-Type': 'application/json',
          },
        }
      );
  
      return response.data;
    } catch (error) {
      throw new Error(`GPT API 호출 실패: ${error}`);
    }
  }

  private sendFailure(client: Socket, errorMessage: string) {
    this.logger.error(errorMessage);
    client.emit('failure', {
      success: false,
      message: errorMessage,
    });
  }
}
