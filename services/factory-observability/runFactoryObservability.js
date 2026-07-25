/**
 * Factory Integration — Block I.1
 * Manual Node entrypoint (READ_ONLY). No HTTP server. No ports. No writes.
 *
 * Run: node services/factory-observability/runFactoryObservability.js
 */

import { readFactoryObservability } from "./factoryObservabilityReader.js";
import {
  sanitizeFatalError,
  sanitizeObservabilitySnapshot,
} from "./factoryObservabilitySanitizer.js";

function main() {
  try {
    const raw = readFactoryObservability();
    const contract = sanitizeObservabilitySnapshot(raw);
    process.stdout.write(`${JSON.stringify(contract, null, 2)}\n`);
    // Empty ELR is success (exit 0). Only fatal read failures use exit 1.
    process.exitCode = 0;
  } catch (err) {
    const payload = sanitizeFatalError(err);
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
    process.exitCode = 1;
  }
}

main();
