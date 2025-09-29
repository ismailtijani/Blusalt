import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { LoadDroneItemDto } from './load-drone-item.dto';

export class LoadDroneDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LoadDroneItemDto)
  items: LoadDroneItemDto[];
}
