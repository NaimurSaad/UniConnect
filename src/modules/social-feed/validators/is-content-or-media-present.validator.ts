import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * Constraint implementation that verifies that a feed post
 * contains either non-empty text content or at least one media item.
 */
@ValidatorConstraint({ name: 'isContentOrMediaPresent', async: false })
export class IsContentOrMediaPresentConstraint
  implements ValidatorConstraintInterface
{
  validate(_value: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    const content = object?.content;
    const media = object?.media;

    const hasContent =
      typeof content === 'string' && content.trim().length > 0;
    const hasMedia = Array.isArray(media) && media.length > 0;

    return Boolean(hasContent || hasMedia);
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'A post must contain either text content or at least one media item.';
  }
}

/**
 * Custom Class-Validator Decorator.
 * Enforces the UniConnect proposal rule: "A post must contain text or at least one media item."
 */
export function IsContentOrMediaPresent(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isContentOrMediaPresent',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsContentOrMediaPresentConstraint,
    });
  };
}

