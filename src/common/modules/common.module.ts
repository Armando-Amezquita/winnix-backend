import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AxiosAdapter } from '../adapters/axios.adapter';
import { Counter, CounterSchema } from '../entities/counter';
import { SequenceService } from '../services/sequency.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]),
  ],
  providers: [AxiosAdapter, SequenceService],
  exports: [AxiosAdapter, MongooseModule, SequenceService],
})
export class CommonModule {}
