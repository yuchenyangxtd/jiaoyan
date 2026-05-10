import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  file_url!: string | null

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ length: 20, default: 'pending' })
  status!: string

  @Column({ type: 'text', nullable: true })
  comment!: string | null

  @Column()
  submitter_id!: string

  @Column({ type: 'varchar', nullable: true })
  reviewer_id!: string | null

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
