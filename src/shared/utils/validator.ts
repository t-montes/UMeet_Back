import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

/**
 * Decorator to validate an entity.
 * Entity should include validations from class-validator.
 * @param target
 * @param propertyKey
 * @param descriptor
 *
 * @validateEntity
 * async create(user: UserEntity): Promise<UserEntity> {
 *  ...
 * }
 *
 * @validateEntity
 * async update(userId: string, user: UserEntity): Promise<UserEntity> {
 *  ...
 * }
 */
export function validateEntity(
  target: any,
  propertyKey: string, // name of the function
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    let entity: any;
    args.forEach((arg) => {
      const type = Object.getPrototypeOf(arg).constructor.name;
      if (type.includes('Entity')) entity = arg;
    });

    const errors = await validate(entity);
    if (errors.length > 0) {
      const errorMsgs = errors.map((error) => {
        const constraints = Object.values(error.constraints);
        return constraints.join(', ');
      });
      throw new BadRequestException(errorMsgs.join(', '));
    }

    return originalMethod.apply(this, args);
  };
}
