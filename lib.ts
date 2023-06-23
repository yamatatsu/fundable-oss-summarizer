export type FundData = {
  funding: Funding | Funding[];
  dependencies?: Record<string, FundData>;
};
type Funding = { url: string };
export type Result = Record<string, number>;

export function countByFundingUrl(
  dependencies: Record<string, FundData>,
): Result {
  return countBy(flattenAndFilter(dependencies));
}

/**
 * flatten dependencies and filter it that is used by same maintainer
 * @param dependencies
 * @param parentUrl
 * @returns
 */
function flattenAndFilter(
  dependencies?: Record<string, FundData>,
  parentUrl?: string,
): string[] {
  if (!dependencies) return [];
  return Object.values(dependencies).flatMap(
    (fundData) => {
      const url = getFundingUrl(fundData);
      const flattened = flattenAndFilter(fundData.dependencies, url);
      return url === parentUrl ? flattened : [url, ...flattened];
    },
  );
}

function countBy(
  arr: string[],
): Record<string, number> {
  return arr.reduce(
    (acc, str) => ({ ...acc, [str]: (acc[str] ?? 0) + 1 }),
    {} as Record<string, number>,
  );
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
