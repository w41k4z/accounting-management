import { Society } from "./Society";
import { ReferenceDocument } from "./ReferenceDocuments";
import { JournalCode } from "./JournalCode";
import { JournalDetail } from "./JournalDetail";
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

@Entity("journals")
export class Journal extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @ManyToOne(() => Society, (society) => society.journals)
  @JoinColumn({ name: "society_id" })
  society?: Society;

  @Column({ name: "journal_date", nullable: false, type: "date" })
  journalDate!: Date;

  @ManyToOne(() => JournalCode, (code) => code.journals)
  @JoinColumn({ name: "code" })
  code?: JournalCode;

  @ManyToOne(
    () => ReferenceDocument,
    (referenceDocument) => referenceDocument.journals
  )
  @JoinColumn({ name: "reference" })
  reference?: ReferenceDocument;

  @Column({ name: "ref_number", nullable: false, length: 11, type: "varchar" })
  @Length(1, 11)
  referenceNumber!: string;

  @Column({ nullable: false, type: "text" })
  description!: string;

  @OneToMany(() => JournalDetail, (journalDetail) => journalDetail.journal)
  journalDetails?: JournalDetail[];
}
