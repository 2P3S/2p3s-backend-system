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

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`❌ ${socket.id} 소켓 연결 해제`);
    const member = await this.memberManager.updateMemberDisconnected(socket.id);
    if (!member) {
      this.logger.error('handleDisconnect find socketId failed');
    }

    socket.to(member.room.toString()).emit('member-disconnected', {
      success: true,
      message: '사용자가 나갔습니다.',
      data: {
        member,
      },
    });
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

      const member = await this.memberManager.updateMemberConnected(
        data.memberId,
        true,
        client.id,
      );
      console.log(member);
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

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; memberId: string; message: string },
  ) {
    try {
      const room = await this.roomManager.getRoom(data.roomId);
      if (!room) {
        throw new WsException('존재하지 않는 방입니다.');
      }

      const member = await this.memberManager.getMember(data.memberId);
      if (!member) {
        throw new WsException('존재하지 않는 사용자입니다.');
      }

      if (member.room.valueOf() !== room.id) {
        throw new WsException('방에 속하지 않은 사용자입니다.');
      }

      client.to(data.roomId).emit('message', {
        success: true,
        message: data.message,
        data: {
          room,
          member,
        },
      });
    } catch (err) {
      this.logger.error(err.message);
      client.emit('message-failed', { success: false, message: err.message });
    }
  }
}
