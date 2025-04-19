import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Query, SchemaTypes, Types } from 'mongoose';

export type RolePermissionDocument = HydratedDocument<RolePermission>;

// --- Middleware Helper ---
const excludeDeletedMiddleware = function (this: Query<any, any>, next) {
  // Añade el filtro { deletedAt: null } a menos que se especifique { withDeleted: true }
  if (this.getOptions().withDeleted !== true) {
    this.where({ deletedAt: null });
  }
  next();
};

@Schema({ timestamps: true })
export class RolePermission {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: Date, default: null, index: true })
  deletedAt?: Date | null;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  })
  deletedBy?: Types.ObjectId | null;
}

export const RolePermissionSchema =
  SchemaFactory.createForClass(RolePermission);

// --- Aplicar Middleware ---
RolePermissionSchema.pre('find', excludeDeletedMiddleware);
RolePermissionSchema.pre('findOne', excludeDeletedMiddleware);
RolePermissionSchema.pre('countDocuments', excludeDeletedMiddleware);
RolePermissionSchema.pre('findOneAndDelete', excludeDeletedMiddleware);
RolePermissionSchema.pre('findOneAndUpdate', excludeDeletedMiddleware);
RolePermissionSchema.pre('updateOne', excludeDeletedMiddleware);
RolePermissionSchema.pre('updateMany', excludeDeletedMiddleware);

// --- Aplicar Índice Único Parcial ---
RolePermissionSchema.index(
  { name: 1 }, // Campo que debe ser único
  {
    unique: true,
    // Solo único si no está borrado
    partialFilterExpression: { deletedAt: null },
  },
);
