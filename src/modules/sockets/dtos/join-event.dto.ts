import { IsString, IsNotEmpty } from 'class-validator';

export class JoinEventDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;
}
