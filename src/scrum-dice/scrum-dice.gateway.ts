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

type EventNames =
  | 'join-success'
  | 'member-connected'
  | 'member-disconnected'
  | 'message';
const MESSAGES: { [eventName in EventNames]: string } = {
  'join-success': '방 입장에 성공했습니다.',
  'member-connected': '사용자가 입장했습니다.',
  'member-disconnected': '사용자가 나갔습니다.',
  message: '메시지를 전송했습니다.',
};

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: 'scrum-dice',
})
export class ScrumDiceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(ScrumDiceGateway.name);
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
    const member = await this.checkSocket(socket.id);
    this.sendToRoom(socket, 'member-disconnected', member.room.toString(), {
      member,
    });
  }

  // @SubscribeMessage('join-room')
  // async handleJoinRoom(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody() body: { roomId: string; memberId: string },
  // ) {
  //   this.checkSocketBody(body.roomId, body.memberId)
  //     .then((data) => this.sendMessage(socket, 'join-success', data))
  //     .catch((err) => this.sendFailure(socket, err.message));
  // }

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
    this.checkSocketBody(body.roomId, body.memberId)
      .then((data) => this.sendToRoom(socket, 'message', body.roomId, data))
      .catch((err) => this.sendFailure(socket, err.message));
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
      throw new WsException('존재하지 않는 사용자입니다111.');
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

  private sendFailure(client: Socket, errorMessage: string) {
    this.logger.error(errorMessage);
    client.emit('failure', {
      success: false,
      message: errorMessage,
    });
  }
}
