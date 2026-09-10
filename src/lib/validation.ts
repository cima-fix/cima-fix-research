export type Validator<T> = (value: T) => string | null;

export const required: Validator<string> = (value) =>
  value.trim().length > 0 ? null : "Este campo es obligatorio";

export function minLength(min: number): Validator<string> {
  return (value) =>
    value.trim().length >= min ? null : `Debe tener al menos ${min} caracteres`;
}

export function maxLength(max: number): Validator<string> {
  return (value) =>
    value.trim().length <= max ? null : `No puede exceder ${max} caracteres`;
}

export function inRange(min: number, max: number): Validator<number> {
  return (value) =>
    value >= min && value <= max ? null : `Debe estar entre ${min} y ${max}`;
}

export function minItems<T>(min: number): Validator<T[]> {
  return (value) =>
    value.length >= min ? null : `Debe haber al menos ${min} elemento(s)`;
}

export function composeValidators<T>(
  ...validators: Validator<T>[]
): Validator<T> {
  return (value) => {
    for (const validate of validators) {
      const error = validate(value);
      if (error !== null) return error;
    }

    return null;
  };
}
