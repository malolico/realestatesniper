/**
 * SP05-P1 — Decision-owned immutable projection (DAG-SP05-P1-G1)
 *
 * Defensive deep clone + recursive freeze so Decision intake never holds a
 * writable shared reference to Factory-delivered corpus.
 * No external dependencies.
 */

/**
 * JSON deep clone — Decision-side independent representation.
 * @param {unknown} value
 * @returns {unknown}
 */
export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Recursively freeze objects and arrays (nested isolation).
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function deepFreeze(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (!Object.isFrozen(value)) {
    Object.freeze(value);
  }

  for (const key of Reflect.ownKeys(value)) {
    const child = value[key];
    if (child !== null && typeof child === "object" && !Object.isFrozen(child)) {
      deepFreeze(child);
    }
  }

  return value;
}

/**
 * Project Factory corpus into Decision-owned immutable representation.
 * @param {object} corpus
 * @returns {object}
 */
export function projectImmutableDecisionCorpus(corpus) {
  if (corpus === null || typeof corpus !== "object") {
    throw new Error(
      "[SP05-P1 Decision Intake] Immutable projection requires an object corpus"
    );
  }
  return deepFreeze(deepClone(corpus));
}
