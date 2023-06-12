import { Society } from "./Society";
import { ReferenceDocument } from "./ReferenceDocument";
import { JournalCode } from "./JournalCode";
import { JournalDetail } from "./JournalDetail";
import { GeneralChartOfAccount } from "./GeneralChartOfAccount";
import { ThirdPartyChartOfAccount } from "./ThirdPartyChartOfAccount";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import createHttpError from "http-errors";
import { Length } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

export interface IDetail {
  generalChartOfAccount: GeneralChartOfAccount;
  thirdPartyChartOfAccount: ThirdPartyChartOfAccount;
  debit: number;
  credit: number;
}

@Entity("journals")
export class Journal extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @ManyToOne(() => Society, (society) => society.journals)
  @JoinColumn({ name: "society_id" })
  society!: Society;

  @Column({ name: "journal_date", nullable: false, type: "date" })
  journalDate!: Date;

  @ManyToOne(() => JournalCode, (code) => code.journals)
  @JoinColumn({ name: "code" })
  code!: JournalCode;

  @ManyToOne(
    () => ReferenceDocument,
    (referenceDocument) => referenceDocument.journals
  )
  @JoinColumn({ name: "reference" })
  reference!: ReferenceDocument;

  @Column({ name: "ref_number", nullable: false, length: 11, type: "varchar" })
  @Length(1, 11)
  referenceNumber!: string;

  @Column({ nullable: false, type: "text" })
  description!: string;

  @OneToMany(() => JournalDetail, (journalDetail) => journalDetail.journal)
  journalDetails: JournalDetail[] = [];

  public async saveDetailedJournal(details: IDetail[]) {
    await AppDataSource.transaction(async (manager) => {
      await manager.save(this);
      for (const detail of details) {
        const newDetail = new JournalDetail();
        newDetail.journal = this;
        newDetail.generalChartOfAccount = detail.generalChartOfAccount;
        newDetail.thirdPartyChartOfAccount = detail.thirdPartyChartOfAccount;
        newDetail.debit = detail.debit;
        newDetail.credit = detail.credit;
        await validate(newDetail).then(async (errors) => {
          if (errors.length > 0) {
            throw createHttpError(400, errors.toString());
          }
          await manager.save(newDetail);
          this.journalDetails.push(newDetail);
        });
      }
    });
  }
}
