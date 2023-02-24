import { walk } from "https://deno.land/std@0.149.0/fs/walk.ts";
import { FundData, Result, summaryRecords } from "./lib.ts";

type FundJSON = {
  dependencies: Record<string, FundData>;
};

let acc: Result = {};

for await (const entry of walk("./jsons", { includeDirs: false })) {
  const json: FundJSON = JSON.parse(Deno.readTextFileSync(entry.path));
  acc = summaryRecords(acc, json.dependencies);
}

console.info(Object.entries(acc).sort((a, b) => b[1] - a[1]));
