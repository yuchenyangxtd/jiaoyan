import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'text', nullable: true })
  content!: string | null

  @Column({ length: 20 })
  semester!: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  department!: string | null

  @Column({ length: 20, default: 'draft' })
  status!: string

  @Column()
  created_by!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
