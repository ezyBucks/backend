import {
    BaseEntity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Entity,
    OneToMany,
    ManyToOne
} from 'typeorm';

import { UserEntity } from './user.entity';
import { TransactionEntity } from './transaction.entity';

@Entity()
export class MetaTransactionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id?: number;

    @ManyToOne(type => UserEntity, {
        eager: true
    })
    public from: UserEntity;

    @ManyToOne(type => UserEntity, {
        eager: true
    })
    public to: UserEntity;

    @CreateDateColumn()
    public timestamp: string;

    @OneToMany(
        type => TransactionEntity,
        transaction => transaction.metaTransaction,
        {
            eager: true
        }
    )
    public transactions: TransactionEntity[];
}
