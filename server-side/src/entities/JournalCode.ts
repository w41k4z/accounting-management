import { Journal } from "./Journal";
import { Length } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("journal_codes")
export class JournalCode extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Column({
    unique: true,
    nullable: false,
    length: 2,
    type: "varchar",
  })
  @Length(2, 2)
  code!: string;

  @Column({ nullable: false, length: 25, type: "varchar" })
  entitled!: string;

  @OneToMany(() => Journal, (journal) => journal.code)
  journals: Journal[] = [];
}
