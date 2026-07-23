/**
 * II.2 structure depth limits (object / array nesting).
 */

import { QUOTAS } from "./constants.js";

/**
 * Measure maximum object-nesting and array-nesting depths.
 * Depth 1 = root object/array itself.
 *
 * @param {unknown} value
 * @returns {{ objectDepth: number, arrayDepth: number }}
 */
export function measureDepths(value) {
  let maxObject = 0;
  let maxArray = 0;

  function walk(node, objectDepth, arrayDepth) {
    if (node === null || typeof node !== "object") return;
    if (Array.isArray(node)) {
      const nextArray = arrayDepth + 1;
      if (nextArray > maxArray) maxArray = nextArray;
      for (const item of node) walk(item, objectDepth, nextArray);
      return;
    }
    const nextObject = objectDepth + 1;
    if (nextObject > maxObject) maxObject = nextObject;
    for (const child of Object.values(node)) {
      walk(child, nextObject, arrayDepth);
    }
  }

  walk(value, 0, 0);
  return { objectDepth: maxObject, arrayDepth: maxArray };
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function collectDepthViolations(value) {
  const { objectDepth, arrayDepth } = measureDepths(value);
  const errors = [];
  if (objectDepth > QUOTAS.MAX_OBJECT_DEPTH) {
    errors.push(
      `object depth ${objectDepth} exceeds MAX_OBJECT_DEPTH ${QUOTAS.MAX_OBJECT_DEPTH}`
    );
  }
  if (arrayDepth > QUOTAS.MAX_ARRAY_DEPTH) {
    errors.push(
      `array depth ${arrayDepth} exceeds MAX_ARRAY_DEPTH ${QUOTAS.MAX_ARRAY_DEPTH}`
    );
  }
  return errors;
}
