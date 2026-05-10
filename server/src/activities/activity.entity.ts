import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ type: 'date', nullable: true })
  date!: string | null

  @Column({ type: 'varchar', length: 200, nullable: true })
  location!: string | null

  @Column({ type: 'varchar', length: 50, nullable: true })
  type!: string | null

  @Column({ length: 20, default: 'planned' })
  status!: string

  @Column()
  created_by!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
