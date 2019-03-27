import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { IsNumber, Min } from 'class-validator';

@Entity()
export class TransactionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id?: number;

    @IsNumber()
    @Min(0, {
        message: 'Transaction amount must be greater than 0'
    })
    @Column({ nullable: false })
    public amount: number;
}
