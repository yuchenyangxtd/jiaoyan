import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 200 })
  title!: string

  @Column({ type: 'varchar', length: 50 })
  type!: string

  @Column({ type: 'text', nullable: true })
  description!: string | null

  @Column({ type: 'varchar', length: 500, nullable: true })
  file_url!: string | null

  @Column({ type: 'varchar', length: 200, nullable: true })
  tags!: string | null

  @Column({ default: 0 })
  download_count!: number

  @Column()
  created_by!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
