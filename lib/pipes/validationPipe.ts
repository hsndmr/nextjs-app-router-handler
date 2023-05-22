import { Context } from '../context';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { ValidationOptions as BaseValidationOptions } from 'class-validator/types/decorator/ValidationOptions';
import { validate, ValidationError } from 'class-validator';
import { BadRequestException } from '../http-exceptions';

export interface ValidationOptions {
  transformOptions?: ClassTransformOptions;
  validatorOptions?: BaseValidationOptions;
}

// https://github.com/nestjs/nest/blob/master/packages/common/pipes/validation.pipe.ts
function prependConstraintsWithParentProp(
  parentPath: string,
  error: ValidationError,
): ValidationError {
  const constraints: Record<string, any> = {};
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`;
  }
  return {
    ...error,
    constraints,
  };
}

// https://github.com/nestjs/nest/blob/master/packages/common/pipes/validation.pipe.ts
function mapChildrenToValidationErrors(
  error: ValidationError,
  parentPath?: string,
): ValidationError[] {
  if (!(error.children && error.children.length)) {
    return [error];
  }
  const validationErrors = [];
  parentPath = parentPath ? `${parentPath}.${error.property}` : error.property;
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenToValidationErrors(item, parentPath));
    }
    validationErrors.push(prependConstraintsWithParentProp(parentPath, item));
  }
  return validationErrors;
}

function flattenValidationErrors(
  validationErrors: ValidationError[],
): string[] {
  return validationErrors
    .flatMap(error => mapChildrenToValidationErrors(error))
    .filter((item: ValidationError) => !!item.constraints)
    .flatMap((item: ValidationError) => Object.values(item.constraints ?? {}));
}

async function validateObject(
  cls: ClassConstructor<unknown>,
  value: Record<string, any> | undefined | null,
  options?: ValidationOptions,
) {
  if (value === null || value === undefined || typeof value !== 'object') {
    value = {};
  }

  const objectValue = plainToInstance(cls, value, options?.transformOptions);

  const errors = await validate(objectValue as object, {
    enableDebugMessages: process.env.NODE_ENV === 'development',
    ...options?.validatorOptions,
  });

  if (errors.length) {
    const flattenedErrors = flattenValidationErrors(errors);
    throw new BadRequestException(flattenedErrors[0], flattenedErrors);
  }

  return objectValue;
}

export const validationPipe = (
  cls: ClassConstructor<unknown>,
  options?: ValidationOptions,
) => {
  return async (ctx: Context) => {
    const validatedBody = await validateObject(cls, ctx.req.body, options);
    ctx.setBody(validatedBody);
  };
};
