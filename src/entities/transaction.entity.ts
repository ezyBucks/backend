import {
    BaseEntity,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
    Column,
    Entity
} from 'typeorm';
import { MetaTransactionEntity } from './metatransaction.entity';

@Entity()
export class TransactionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id?: number;

    @OneToOne(type => MetaTransactionEntity)
    @JoinColumn()
    public from: MetaTransactionEntity;

    @Column()
    public amount: number;
}
