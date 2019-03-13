import bcrypt from 'bcryptjs';
import {
    BaseEntity,
    BeforeInsert,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Unique
} from 'typeorm';

import { IsEmail, IsString, MinLength } from 'class-validator';
import { EzyEntity } from '.';

// http://typeorm.io/#/active-record-data-mapper using active record style.
@Entity()
@Unique(['email', 'username'])
export class UserEntity extends EzyEntity {
    @PrimaryGeneratedColumn()
    public id?: number;

    @IsEmail()
    @Column()
    public email: string = '';

    @IsString()
    @Column()
    public username: string = '';

    @MinLength(5, {
        message: 'Password must be more than 5 characters.'
    })
    @Column({
        nullable: true,
        select: false
    })
    public password: string = '';

    @Column({ nullable: false, default: false })
    public verified: boolean = false;

    @Column({ nullable: false, default: true })
    public active: boolean = true;

    public async comparePassword(potential: string) {
        return await bcrypt.compare(potential, this.password);
    }

    @BeforeInsert()
    protected async hashPassword() {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }

    protected nonResponseFields(): string[] {
        return ['password'];
    }

    // @AfterLoad()
    // Can unhash pass here if we want to be loose
}

export default UserEntity;
