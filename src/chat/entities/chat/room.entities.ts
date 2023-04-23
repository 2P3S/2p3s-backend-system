import { Member } from './member.entities';

export class Room {
  id: string;
  name: string;
  members: Member[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.members = [];
  }
}
