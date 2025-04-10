export const isValidEnumValue = <T extends object>(enumObj: T, value: any): value is T[keyof T] => {
  return Object.values(enumObj).includes(value);
};
