import * as randomBytes from "randombytes";
import { v1 } from "uuid";

export * from "uuid";

export interface V6SetupOpts {
    disableRandom: boolean;
}

export interface v6 {
  (): string;
}

export function v6setup(opts?: Partial<V6SetupOpts>): v6  {
  const options = opts || {};

  const disableRandom = Boolean(options.disableRandom);

  function generateId() {
    const raw = v1();

    const prefix = `${raw.substring(15, 18)}${raw.substring(9, 13)}${raw.substring(0, 5)}6${raw.substring(5, 8)}`;
    const prefixFormatted = `${prefix.substr(0, 8)}-${prefix.substr(8, 4)}-${prefix.substr(12)}`;

    if (disableRandom) {
      return `${prefixFormatted}${raw.substr(18)}`;
    }

    const random = randomBytes(8).toString('hex');

    return `${prefixFormatted}-${random.substring(0, 4)}-${random.substring(4)}`;
  }

  return generateId;
}

export const v6: v6 = v6setup();

