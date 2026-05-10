import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('trainings')
export class Training {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ type: 'date', nullable: true })
  start_date!: string | null

  @Column({ type: 'date', nullable: true })
  end_date!: string | null

  @Column({ type: 'varchar', length: 200, nullable: true })
  location!: string | null

  @Column({ length: 20, default: 'planned' })
  status!: string

  @Column()
  created_by!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
