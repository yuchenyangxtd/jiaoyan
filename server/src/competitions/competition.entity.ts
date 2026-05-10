import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('competitions')
export class Competition {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ type: 'date', nullable: true })
  deadline!: string | null

  @Column({ length: 20, default: 'upcoming' })
  status!: string

  @Column()
  created_by!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
