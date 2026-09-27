/** Turn lean Mongo docs into plain props (ObjectId/Date → string) safe to pass to client components. */
export function plain<T>(value: T): Serialized<T> {
  return JSON.parse(JSON.stringify(value));
}

export type Serialized<T> = T extends Date
  ? string
  : T extends { toHexString(): string }
    ? string
    : T extends (infer U)[]
      ? Serialized<U>[]
      : T extends object
        ? { [K in keyof T]: Serialized<T[K]> }
        : T;
