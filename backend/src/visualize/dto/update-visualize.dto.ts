import { PartialType } from '@nestjs/mapped-types';
import { CreateVisualizeDto } from './create-visualize.dto';

export class UpdateVisualizeDto extends PartialType(CreateVisualizeDto) {}
