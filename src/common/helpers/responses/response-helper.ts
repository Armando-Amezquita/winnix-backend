import { HttpStatus } from '@nestjs/common';
import { SuccessResponseDto } from '../dto/response.dto';
import { IPaginatedResponse } from 'src/common/interfaces/pagination-response.interface';

type PaginationMeta = IPaginatedResponse<any>['meta'];

/**
 * Creates a standardized successful response object.
 *
 * @param data The data payload to be included in the response.
 * @param message Optional custom success message. Defaults to 'Success'.
 * @param statusCode Optional HTTP status code. Defaults to HttpStatus.OK (200). Use HttpStatus.CREATED (201) for resource creation.
 * @param meta Optional metadata object (e.g., for pagination).
 * @returns A SuccessResponseDto object.
 */
export function createSuccessResponse<
  T = any,
  M = PaginationMeta | Record<string, any> | null,
>(
  data: T | null,
  message: string = 'Success',
  statusCode: HttpStatus = HttpStatus.OK,
  meta?: M | null,
): SuccessResponseDto<T, M> {
  return new SuccessResponseDto(data, message, statusCode, meta);
}

// --- HELPER ESPECÍFICO PARA PAGINACIÓN ---
/**
 * @param paginatedResult The object containing 'data' and 'meta' from the service.
 * @param message Optional custom success message. Defaults to 'Retrieved successfully'.
 * @param statusCode Optional HTTP status code. Defaults to HttpStatus.OK (200).
 * @returns A SuccessResponseDto object formatted for pagination.
 */
export function createPaginatedSuccessResponse<T = any>(
  paginatedResult: IPaginatedResponse<T>,
  message: string = 'Retrieved successfully',
  statusCode: HttpStatus = HttpStatus.OK,
): SuccessResponseDto<T[], PaginationMeta> {
  return createSuccessResponse(
    paginatedResult.data,
    message,
    statusCode,
    paginatedResult.meta,
  );
}
