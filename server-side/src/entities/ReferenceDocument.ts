import { Journal } from "./Journal";
import { Length } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("reference_documents")
export class ReferenceDocument extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Column({
    unique: true,
    nullable: false,
    length: 2,
    type: "varchar",
  })
  @Length(2, 2)
  reference!: string;

  @Column({ nullable: false, length: 25, type: "varchar" })
  meaning!: string;

  @OneToMany(() => Journal, (journal) => journal.reference)
  journals: Journal[] = [];
}
