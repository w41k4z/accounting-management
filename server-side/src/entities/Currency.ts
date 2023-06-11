import { Society } from "./Society";
import { Length } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("currencies")
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Column({ unique: true, nullable: false, length: 3, type: "varchar" })
  @Length(3, 3)
  label!: string;

  @OneToOne(() => Society, (society) => society.currency)
  society?: Society;
}
