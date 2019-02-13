import {
    BaseEntity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    Entity
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity()
export class MetaTransactionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id?: number;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    public from: UserEntity;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    public to: UserEntity;

    @CreateDateColumn()
    public timestamp: string;
}
