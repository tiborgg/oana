import { Error } from "./errors";
import { Result } from "./types";

type JsonReviver = (this: any, key: string, value: any) => any;

/**
 * Safely calls `JSON.parse` and returns a `Result` object.
 * 
 * @param text    A valid JSON string.
 * @param reviver A function that transforms the results. This function is called for each member of the object.
 */
export function parseJson<T = any>(text: string, reviver?: JsonReviver): Result<T> {
  try {
    return [JSON.parse(text, reviver)];
  } catch (rawErr) {
    const err = new Error('JsonParseError', {
      source: rawErr
    });
    return [null, err];
  }
}

/**
 * Safely calls `JSON.stringify` and returns a `Result` object.
 * @param value     A JavaScript value, usually an object or array, to be converted.
 * @param replacer  A function that transforms the results.
 * @param space     Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 */
export function stringifyJson(
  value: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number): Result<string> {

  try {
    return [JSON.stringify(value, replacer, space)];
  } catch (rawErr) {
    const err = new Error('JsonStringifyError', {
      source: rawErr
    });
    return [null, err];
  }
}