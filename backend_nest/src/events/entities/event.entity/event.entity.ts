import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(['name', 'type'])
@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;

    @Index()
    @Column()
    name: string;

    @Column({type: 'json'})
    payload: Record<string, any>;
}
