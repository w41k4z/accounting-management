import { JournalDetail } from "./JournalDetail";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum AccountType {
  FO = "FO", // fournisseur
  CL = "CL", // client
}

@Entity("third_party_chart_of_accounts")
export class ThirdPartyChartOfAccount extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Column({
    nullable: false,
    type: "enum",
    enum: AccountType,
    default: AccountType.CL,
  })
  type!: AccountType;

  @Column({ nullable: false, length: 25, type: "varchar" })
  entitled!: string;

  @OneToMany(() => JournalDetail, (journalDetail) => journalDetail.journal)
  journalDetails: JournalDetail[] = [];
}
