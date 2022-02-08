import * as uuid from "./";

// Help function
const outputHelp = () => {
  console.log(`UUIDGEN

SYNOPSIS
    uuidgen ([options]) v1|v4|v6
    uuidgen ([options]) v3|v5 [name] [namespace-uuid]
    uuidgen -h|--help

DESCRIPTION
    Generate a UUID of the given version

OPTIONS
    -n|--number [qty]    Generate [qty] uuids

`);
}

// Default values
type NonNamespaced = { t: "non-namespaced"; v: "v1"|"v4"|"v6"; };
type Namespaced = { t: "namespaced"; v: "v3"|"v5"; name: string; namespaceUuid: string; };
type Params = Namespaced | NonNamespaced;
let params: Params | null = null;
let qty = 1;

// Get command line arguments
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg.match(/^v[13456]$/)) {
    // Set the UUID version
    if (arg === "v3" || arg == "v5") {
      const name = process.argv[++i];
      const namespaceUuid = process.argv[++i];

      if (!name || !namespaceUuid) {
        outputHelp();
        console.error(`E: For uuid ${arg}, you must provide additional [name] and [namespaceUuid] arguments. You passed '${name}' for name and '${namespaceUuid}' for namespaceUuid`);
        process.exit(1);
      }

      params = {
        t: "namespaced",
        v: <"v3"|"v5">arg,
        name,
        namespaceUuid,
      }
    } else {
      params = {
        t: "non-namespaced",
        v: <"v1"|"v4"|"v6">arg,
      }
    }
  } else if (arg.match(/^-n|--number$/)) {
    // Increment i and get the value
    i++;
    const val = process.argv[i];
    if (!val.match(/^[0-9]+$/)) {
      console.error(`E: The value of the -n|--number argument must be a positive integer. You passed '${val}'`);
      process.exit(2);
    }
    qty = Number(val);
  } else if (arg.match(/^-h|--help$/)) {
    outputHelp();
    process.exit();
  } else {
    console.error(`E: Unknown argument: '${arg}'`);
    process.exit(3);
  }
}

// Verify parameters
if (params === null) {
  outputHelp();
  console.error(`E: You must specify a UUID version to generate. Possible versions are v1, v3, v4, v5 and v6.`);
  process.exit(11);
}

// Generate and output
if (params.t === "non-namespaced") {
  for (let i = 0; i < qty; i++) {
    console.log(uuid[params.v]());
  }
} else {
  for (let i = 0; i < qty; i++) {
    console.log(uuid[params.v](params.name, params.namespaceUuid));
  }
}

