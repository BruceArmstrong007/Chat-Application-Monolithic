import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'matchPassword', async: false })
export class matchPassword implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {

      if (password !== (args.object as any)[args.constraints[0]]) return false;
      return true;
   }

   defaultMessage(args: ValidationArguments) {
      return "Passwords do not match!";
  }
}