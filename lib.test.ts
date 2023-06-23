import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { countByFundingUrl } from "./lib.ts";

Deno.test("count Funding", () => {
  const result = countByFundingUrl({
    ownerA_lib1: { funding: { url: "https://example.com/ownerA1" } },
    ownerA_lib2: {
      funding: [{ url: "https://example.com/ownerA1" }, {
        url: "https://example.com/ownerA2",
      }],
    },
    ownerA_lib3_differentUrl: {
      funding: { url: "https://example.com/ownerA2" },
    },
    ownerA_lib4_parent: {
      funding: { url: "https://example.com/ownerA1" },
      dependencies: {
        ownerA_lib5_same_owner: {
          funding: { url: "https://example.com/ownerA1" },
        },
        ownerB_lib1_other_owner: {
          funding: { url: "https://example.com/ownerB1" },
          dependencies: {
            ownerA_lib6_same_as_grandparent: {
              funding: { url: "https://example.com/ownerA1" },
            },
          },
        },
      },
    },
  });
  assertEquals(result, {
    ["https://example.com/ownerA1"]: 4,
    ["https://example.com/ownerA2"]: 1,
    ["https://example.com/ownerB1"]: 1,
  });
});
