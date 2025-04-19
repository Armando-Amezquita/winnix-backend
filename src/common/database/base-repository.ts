import {
  Document,
  Model,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ProjectionType,
  Types,
  isValidObjectId,
} from 'mongoose';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { PaginationDto } from '../dto/pagination.dto';
import { IPaginatedResponse } from '../interfaces/pagination-response.interface';

export interface ISoftDeletable {
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | null;
}

export abstract class BaseRepository<T extends Document & ISoftDeletable> {
  protected constructor(protected readonly model: Model<T>) {}

  /**
   * Realiza un borrado lógico (establece deletedAt).
   * Asume que el middleware pre-hook en el schema filtra los ya borrados.
   */
  async softDelete(id: string, userId: Types.ObjectId | string): Promise<T> {
    const updateQuery: UpdateQuery<T> = {
      deletedAt: new Date(),
      deletedBy: userId,
    };

    const deletedDoc = await this.model
      .findOneAndUpdate({ _id: id } as FilterQuery<T>, updateQuery, {
        new: true,
      })
      .exec();

    if (!deletedDoc) {
      throw new NotFoundException(
        `${this.model.modelName} with ID "${id}" not found or already deleted.`,
      );
    }
    return deletedDoc;
  }

  /**
   * Restaura un documento borrado lógicamente (establece deletedAt a null).
   */
  async restore(id: string): Promise<T> {
    const docToRestore = await this.model
      .findOne({ _id: id, deletedAt: { $ne: null } } as FilterQuery<T>, {}, {
        withDeleted: true,
      } as QueryOptions)
      .exec();

    if (!docToRestore) {
      throw new NotFoundException(
        `${this.model.modelName} with ID "${id}" not found or is not deleted.`,
      );
    }

    docToRestore.deletedAt = null;
    try {
      return await docToRestore.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to restore ${this.model.modelName} with ID "${id}". Error: ${error.message}`,
      );
    }
  }

  // --- Métodos CRUD Genéricos ---

  /**
   * Crea un nuevo documento.
   */
  async create(createDto: Partial<T>): Promise<T> {
    const createdEntity = new this.model(createDto);
    return createdEntity.save() as Promise<T>;
  }

  /**
   * Busca por ID (excluye borrados por defecto).
   */
  async findById(
    id: string,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T | null> {
    return this.model.findById(id, projection, options).exec();
  }

  /**
   * Busca un documento por filtro (excluye borrados por defecto).
   */
  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T | null> {
    return this.model.findOne(filter, projection, options).exec();
  }

  /**
   * Obtiene una lista de documentos según filtro, proyección y opciones.
   * NO realiza conteo ni devuelve metadatos de paginación.
   * @param filter Filtro de Mongoose.
   * @param projection Proyección de campos.
   * @param options Opciones como sort, limit (¡pero sin skip calculado automáticamente!), etc.
   * @returns Promesa con un array de documentos.
   */
  async findAll(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null, // Acepta sort, limit, skip manual, etc.
  ): Promise<T[]> {
    return this.model.find(filter, projection, options).exec();
  }

  /**
   * Realiza una consulta paginada DIRECTAMENTE, obteniendo datos y metadatos.
   * Ejecuta find y countDocuments en paralelo.
   * Excluye borrados lógicamente por defecto.
   * @param filter Filtro de Mongoose para la búsqueda.
   * @param paginationDto DTO con page y limit.
   * @param projection Opcional: Proyección para seleccionar campos.
   * @param options Opcional: Otras opciones de consulta (ej. sort).
   * @returns Un objeto IPaginatedResponse con data y meta.
   */
  public async paginate(
    filter: FilterQuery<T>,
    paginationDto?: PaginationDto,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<IPaginatedResponse<Partial<T>>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const effectiveLimit = Math.max(1, limit);
    const effectivePage = Math.max(1, page);

    const skip = (effectivePage - 1) * effectiveLimit;
    const queryOptions: QueryOptions<T> = {
      ...options,
      limit: effectiveLimit,
      skip: skip,
    };

    const dataPromise = this.model
      .find(filter, projection, queryOptions)
      .exec();

    const totalItemsPromise = this.countActives(filter);

    const [data, totalItems] = await Promise.all([
      dataPromise,
      totalItemsPromise,
    ]);

    // Calcula metadatos
    const itemCount = data.length;
    const totalPages = Math.ceil(totalItems / effectiveLimit);

    return {
      data: data as Partial<T>[],
      meta: {
        totalItems,
        itemCount,
        itemsPerPage: effectiveLimit,
        totalPages,
        currentPage: effectivePage,
      },
    };
  }

  async findByTerm(
    term: string,
    field?: string,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T[] | null> {
    const query = isValidObjectId(term)
      ? { _id: term }
      : { $or: [{ name: term }, { [field]: term }] };

    return this.model.find(query, projection, options);
  }

  /**
   * Realiza una consulta paginada buscando por un término que puede ser un ID
   * o un valor en campos específicos (por defecto 'name' y el campo opcional proporcionado).
   *
   * @param term El término de búsqueda (ID, nombre, u otro valor de campo).
   * @param paginationDto DTO con page y limit.
   * @param field Opcional: El nombre de un campo adicional para buscar si 'term' no es un ID.
   * @param projection Opcional: Proyección para seleccionar campos.
   * @param options Opcional: Otras opciones de consulta (ej. sort).
   * @returns Un objeto IPaginatedResponse con data y meta.
   */
  public async paginateByTerm(
    term: string,
    field?: keyof T | string,
    paginationDto?: PaginationDto,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<IPaginatedResponse<Partial<T>>> {
    let filter: FilterQuery<T>;

    if (term && typeof term === 'string' && term.trim() !== '') {
      if (isValidObjectId(term)) {
        filter = { _id: term } as FilterQuery<T>;
      } else {
        const orConditions: FilterQuery<T>[] = [];
        orConditions.push({ name: term } as FilterQuery<T>);
        if (
          field &&
          typeof field === 'string' &&
          field.trim() !== '' &&
          field !== '_id' &&
          field !== 'name'
        ) {
          orConditions.push({ [field]: term } as FilterQuery<T>);
        }

        // Si solo hay una condición (ej. solo 'name'), no necesitas $or
        if (orConditions.length === 1) {
          filter = orConditions[0];
        } else {
          filter = { $or: orConditions };
        }
      }
    }

    return this.paginate(filter, paginationDto, projection, options);
  }

  /**
   * Actualiza un documento por ID (opera solo en activos por defecto).
   */
  async update(id: string, updateDto: UpdateQuery<T>): Promise<T | null> {
    const updated = await this.model
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updated) {
      // Podría no encontrarlo o estar borrado
      throw new NotFoundException(
        `${this.model.modelName} with ID "${id}" not found or deleted.`,
      );
    }
    return updated;
  }

  // --- Métodos para incluir borrados ---

  async findByIdWithDeleted(id: string): Promise<T | null> {
    return this.model
      .findOne({ _id: id } as FilterQuery<T>, {}, { withDeleted: true })
      .exec();
  }

  async findAllWithDeleted(
    filter: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    const queryOptions = { ...options, withDeleted: true };
    return this.model.find(filter, {}, queryOptions).exec();
  }

  // --- Borrado físico (usar con precaución) ---
  async hardDelete(
    id: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    const result = await this.model
      .deleteOne({ _id: id } as FilterQuery<T>)
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `${this.model.modelName} with ID "${id}" not found.`,
      );
    }
    return result;
  }

  /**
   * Cuenta los documentos que coinciden con el filtro (excluye borrados por defecto).
   */
  async countActives(filter: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
