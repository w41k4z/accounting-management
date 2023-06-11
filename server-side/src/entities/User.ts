import { Society } from "./Society";
import { IsDate, IsEmail, Length, MinLength } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Column({ nullable: false, length: 25, type: "varchar" })
  @MinLength(3)
  name!: string;

  @Column({ name: "first_name", nullable: true, length: 25, type: "varchar" })
  @MinLength(3)
  firstName?: string;

  @Column({ nullable: false, type: "date" })
  @IsDate()
  birthdate!: Date;

  @Column({ unique: false, nullable: false, length: 25, type: "varchar" })
  @IsEmail()
  email!: string;

  @Column({ name: "phone_number", nullable: true, length: 14, type: "varchar" })
  @Length(14, 14)
  phoneNumber?: string;

  @Column({ nullable: true, length: 50, type: "varchar" })
  address?: string;

  @OneToOne(() => Society, (society) => society.ceo)
  society?: Society;
}
