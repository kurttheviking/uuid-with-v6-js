const crypto = require('crypto');
const uuid = require('uuid');

function create(opts) {
  const options = opts || {};

  const disableRandom = Boolean(options.disableRandom);

  function generateId() {
    const raw = uuid.v1();

    const prefix = `${raw.substring(15, 18)}${raw.substring(9, 13)}${raw.substring(0, 5)}6${raw.substring(5, 8)}`;
    const prefixFormatted = `${prefix.substr(0, 8)}-${prefix.substr(8, 4)}-${prefix.substr(12)}`;

    if (disableRandom) {
      return `${prefixFormatted}${raw.substr(18)}`;
    }

    const random = crypto.randomBytes(8).toString('hex');

    return `${prefixFormatted}-${random.substring(0, 4)}-${random.substring(4)}`;
  }

  return generateId;
}

module.exports = Object.assign(uuid, { v6: create(), v6setup: create });
