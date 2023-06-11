import { JournalDetail } from "./JournalDetail";
import { Length } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("general_chart_of_accounts")
export class GeneralChartOfAccount extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Column({
    name: "account_number",
    unique: true,
    nullable: false,
    length: 5,
    type: "varchar",
  })
  @Length(5, 5)
  accountNumber!: string;

  @Column({ nullable: true, length: 50, type: "varchar" })
  entitled?: string;

  @OneToMany(() => JournalDetail, (journalDetail) => journalDetail.journal)
  journalDetails?: JournalDetail[];
}
