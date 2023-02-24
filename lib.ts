export type FundData = {
  funding: Funding | Funding[];
  dependencies?: Record<string, FundData>;
};
type Funding = { url: string };
export type Result = Record<string, number>;

export function summaryRecords(
  acc: Result,
  dependencies: Record<string, FundData>,
  parent?: FundData,
): Result {
  return Object.values(dependencies).reduce<Result>(
    (_acc, fundData) => summaryFundData(_acc, fundData, parent),
    acc,
  );
}

function summaryFundData(
  acc: Result,
  fundData: FundData,
  parent?: FundData,
): Result {
  const _acc = fundData.dependencies
    ? summaryRecords(acc, fundData.dependencies, fundData)
    : acc;

  const url = getFundingUrl(fundData);

  if (parent && url === getFundingUrl(parent)) {
    return _acc;
  }

  const count = (_acc[url] ?? 0) + 1;

  return { ..._acc, [url]: count };
}

function getFundingUrl(fundData: FundData): string {
  const url = Array.isArray(fundData.funding)
    ? fundData.funding[0].url
    : fundData.funding.url;

  // https://github.com/sponsors/xxxxx => https://github.com/xxxxx
  if (url.startsWith("https://github.com/sponsors")) {
    return url.replace(/\/sponsors/, "");
  }
  // https://github.com/xxxxx/yyyyy?sponsor=1 => https://github.com/chalk/xxxxx
  if (url.startsWith("https://github.com")) {
    return (url.match(/^https\:\/\/github\.com\/[^/]+/) ?? [""])[0];
  }
  return url;
}
