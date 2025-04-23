import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CounterDocument = HydratedDocument<Counter>;

@Schema({ timestamps: true })
export class Counter {
  @Prop({ trim: true, required: true })
  _id: string;

  @Prop({ trim: true, required: true, default: 0 })
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);

CounterSchema.index(
  { seq: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null },
  },
);
