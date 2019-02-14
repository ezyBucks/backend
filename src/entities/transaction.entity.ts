import {
    BaseEntity,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
    Column,
    Entity
} from 'typeorm';
import { MetaTransactionEntity } from './metatransaction.entity';
import { IsNumber, Min } from 'class-validator';

@Entity()
export class TransactionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id?: number;

    @OneToOne(type => MetaTransactionEntity)
    @JoinColumn()
    public metaTransaction: MetaTransactionEntity;

    @IsNumber()
    @Min(0, {
        message: 'Transaction amount must be greater than 0'
    })
    @Column({ nullable: false })
    public amount: number;
}
