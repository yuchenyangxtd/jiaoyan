import { PartialType } from '@nestjs/mapped-types'
import { CreateSkillContestDto } from './create-skill-contest.dto'

export class UpdateSkillContestDto extends PartialType(CreateSkillContestDto) {}
