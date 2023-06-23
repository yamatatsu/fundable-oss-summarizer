import { walk } from "https://deno.land/std@0.149.0/fs/walk.ts";
import { countByFundingUrl, FundData, Result } from "./lib.ts";

type FundJSON = {
  dependencies: Record<string, FundData>;
};

let result: Result = {};

for await (const entry of walk("./jsons", { includeDirs: false })) {
  const json: FundJSON = JSON.parse(Deno.readTextFileSync(entry.path));
  const _result = countByFundingUrl(json.dependencies);
  result = merge(result, _result);
}

console.info(Object.entries(result).sort((a, b) => b[1] - a[1]));

function merge(a: Result, b: Result): Result {
  return Object.entries(b).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: (acc[key] ?? 0) + value }),
    a,
  );
}
