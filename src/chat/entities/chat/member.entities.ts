export class Member {
  id: string;
  name: string;
  status: boolean;
  roomId: string;

  constructor(id: string, name: string, roomId: string) {
    this.id = id;
    this.name = name;
    this.status = false;
    this.roomId = roomId;
  }
}
