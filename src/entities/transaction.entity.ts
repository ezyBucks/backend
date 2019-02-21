import {
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    Entity,
    ManyToOne
} from 'typeorm';
import { MetaTransactionEntity } from './metatransaction.entity';
import { IsNumber, Min } from 'class-validator';

@Entity()
export class TransactionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id?: number;

    @ManyToOne(type => MetaTransactionEntity)
    public metaTransaction: MetaTransactionEntity;

    @IsNumber()
    @Min(0, {
        message: 'Transaction amount must be greater than 0'
    })
    @Column({ nullable: false })
    public amount: number;
}
