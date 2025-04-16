import { HttpStatus } from '@nestjs/common';
import { SuccessResponseDto } from '../dto/response.dto';

/**
 * Creates a standardized successful response object.
 *
 * @param data The data payload to be included in the response.
 * @param message Optional custom success message. Defaults to 'Success'.
 * @param statusCode Optional HTTP status code. Defaults to HttpStatus.OK (200). Use HttpStatus.CREATED (201) for resource creation.
 * @returns A SuccessResponseDto object.
 */
export function createSuccessResponse<T>(
  data: T | null,
  message: string = 'Success',
  statusCode: HttpStatus = HttpStatus.OK,
): SuccessResponseDto<T> {
  return new SuccessResponseDto(data, message, statusCode);
}
