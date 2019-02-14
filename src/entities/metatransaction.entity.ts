import {
    BaseEntity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    Entity,
    OneToMany
} from 'typeorm';

import { UserEntity } from './user.entity';
import { TransactionEntity } from './transaction.entity';

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

    @OneToMany(
        type => TransactionEntity,
        transaction => transaction.metaTransaction
    )
    public transactions: TransactionEntity[];
}
