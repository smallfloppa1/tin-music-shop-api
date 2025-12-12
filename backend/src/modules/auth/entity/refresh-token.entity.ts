import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  token: string;

  user_id: number;
}
