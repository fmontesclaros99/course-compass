/**
 * The element type of an array or readonly tuple.
 * ElementOf<readonly ['a', 'b']> is 'a' | 'b'; ElementOf<string> is never.
 */
export type ElementOf<T> = T extends readonly (infer Item)[] ? Item : never;