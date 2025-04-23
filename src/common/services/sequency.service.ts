import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Counter, CounterDocument } from '../entities/counter';

@Injectable()
export class SequenceService {
  private readonly logger = new Logger(SequenceService.name);

  constructor(
    @InjectModel(Counter.name)
    private readonly counterModel: Model<CounterDocument>,
  ) {}

  /**
   * Obtiene el siguiente valor de una secuencia atómica.
   * @param sequenceName El _id del documento contador (ej. "userIdSequence")
   * @returns El siguiente número en la secuencia.
   */
  async getNextSequenceValue(sequenceName: string): Promise<number> {
    try {
      const sequenceDocument = await this.counterModel
        .findByIdAndUpdate(
          sequenceName,
          // Incrementa atómicamente
          { $inc: { seq: 1 } },
          {
            new: true,
            upsert: true,
            fields: { seq: 1 },
          },
        )
        .exec();

      if (!sequenceDocument) {
        this.logger.error(
          `Counter document ${sequenceName} not found or created after upsert.`,
        );
        throw new InternalServerErrorException(
          'Could not retrieve sequence value.',
        );
      }
      return sequenceDocument.seq;
    } catch (error) {
      this.logger.error(
        `Error getting next sequence value for ${sequenceName}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to generate sequence ID.');
    }
  }
}
