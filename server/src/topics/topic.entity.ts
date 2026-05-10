import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'varchar', length: 50 })
  type!: string

  @Column({ type: 'text', nullable: true })
  content!: string | null

  @Column({ length: 20, default: 'draft' })
  status!: string

  @Column()
  created_by!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
