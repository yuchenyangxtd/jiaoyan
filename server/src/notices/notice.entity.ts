import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('notices')
export class Notice {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'text', nullable: true })
  content!: string | null

  @Column({ default: false })
  is_pinned!: boolean

  @Column()
  created_by!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
