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

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(ChatGateway.name);
  @WebSocketServer()
  private namespace: Namespace;

  constructor(
    private readonly roomManager: RoomService,
    private readonly memberManager: MemberService,
  ) {}

  afterInit() {
    this.logger.log('웹소켓 서버 초기화 🤩');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`✅ ${socket.id} 소켓 연결 성공`);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`❌ ${socket.id} 소켓 연결 해제`);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; memberId: string },
  ) {
    try {
      const room = await this.roomManager.getRoom(data.roomId);
      if (!room) {
        throw new WsException('존재하지 않는 방입니다.');
      }

      const member = await this.memberManager.updateMemberStatus(data.memberId);
      if (!member) {
        throw new WsException('존재하지 않는 사용자입니다.');
      }

      if (member.room.valueOf() !== room.id) {
        throw new WsException('방에 속하지 않은 사용자입니다.');
      }

      client.emit('join-success', {
        success: true,
        message: '방 입장에 성공했습니다.',
        data: {
          room,
          member,
        },
      });
    } catch (err) {
      this.logger.error(err.message);
      client.emit('join-failed', { success: false, message: err.message });
    }
  }
}
