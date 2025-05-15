export function getEnumOptions<T extends Record<string, string>>(
  enumObj: T,
  translations: Record<keyof T, string>
) {
  return Object.keys(enumObj).map((key) => ({
    label: translations[key as keyof T],
    value: enumObj[key as keyof T],
  }));
}
