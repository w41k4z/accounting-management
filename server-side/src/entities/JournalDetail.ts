import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Journal } from "./Journal";
import { GeneralChartOfAccount } from "./GeneralChartOfAccount";
import { ThirdPartyChartOfAccount } from "./ThirdPartyChartOfAccount";

@Entity("journal_details")
export class JournalDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Journal, (journal) => journal.journalDetails)
  @JoinColumn({ name: "journal_id" })
  journal?: Journal;

  @ManyToOne(
    () => GeneralChartOfAccount,
    (generalChartOfAccount) => generalChartOfAccount.journalDetails
  )
  @JoinColumn({ name: "general_account_id" })
  generalChartOfAccount?: GeneralChartOfAccount;

  @ManyToOne(
    () => ThirdPartyChartOfAccount,
    (thirdPartyChartOfAccount) => thirdPartyChartOfAccount.journalDetails
  )
  @JoinColumn({ name: "third_party_account_id" })
  thirdPartyChartOfAccount?: ThirdPartyChartOfAccount;

  @Column({ nullable: false, type: "numeric" })
  debit!: number;

  @Column({ nullable: false, type: "numeric" })
  credit!: number;
}
