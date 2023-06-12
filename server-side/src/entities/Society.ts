import { User } from "./User";
import { Currency } from "./Currency";
import { Journal } from "./Journal";
import { IsDate, MinLength } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("societies")
export class Society extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @OneToOne(() => User, (user) => user.society)
  @JoinColumn({ name: "user_id" })
  ceo!: User;

  @Column({ nullable: false, length: 16, type: "varchar" })
  password!: string;

  @Column({ nullable: false, length: 25, type: "varchar" })
  @MinLength(3)
  name!: string;

  @Column({ nullable: false, length: 50, type: "varchar" })
  @MinLength(5)
  logo!: string;

  @Column({ nullable: false, type: "text" })
  @MinLength(5)
  object!: string;

  @Column({ nullable: false, type: "text" })
  address!: string;

  @Column({ nullable: false, length: 25, type: "varchar" })
  headquarters!: string;

  @Column({ name: "creation_date", nullable: false, type: "date" })
  @IsDate()
  creationDate!: Date;

  @Column({ name: "tin", nullable: true, length: 25, type: "varchar" })
  taxIdentificationNumber?: string;

  @Column({ name: "stn", nullable: true, length: 25, type: "varchar" })
  statisticalNumber?: string;

  @Column({ name: "crgn", nullable: true, length: 25, type: "varchar" })
  commercialRegisterNumber?: string;

  @Column({ nullable: true, length: 25, type: "varchar" })
  status?: string;

  @Column({ name: "stdtacpd", nullable: false, type: "date" })
  startDateOfAccountingPeriod!: Date;

  @OneToOne(() => Currency, (currency) => currency.society)
  @JoinColumn({ name: "accounting_currency" })
  currency!: Currency;

  @OneToMany(() => Journal, (journal) => journal.society)
  journals: Journal[] = [];
}
