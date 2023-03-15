## Prerequisite

- install deno

## Usage

1. `npm fund --json` in your npm project
   - If you use `yarn`, use `npm i` to create `package-lock.json`
1. put json files created by step1 to dir `./jsons`
1. `deno run --allow-read=jsons main.ts`
