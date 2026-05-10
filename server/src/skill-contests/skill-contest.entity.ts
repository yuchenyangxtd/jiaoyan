import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('skill_contests')
export class SkillContest {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ type: 'date', nullable: true })
  contest_date!: string | null

  @Column({ type: 'varchar', length: 50, nullable: true })
  level!: string | null

  @Column({ length: 20, default: 'upcoming' })
  status!: string

  @Column()
  created_by!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
