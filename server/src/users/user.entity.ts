import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 50, unique: true })
  username!: string

  @Column({ length: 255, select: false })
  password_hash!: string

  @Column({ length: 100 })
  real_name!: string

  @Column({ length: 20, default: 'teacher' })
  role!: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  department!: string | null

  @Column({ default: true })
  is_active!: boolean

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
