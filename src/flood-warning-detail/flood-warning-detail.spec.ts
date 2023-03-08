import { getFloodWarningDetail } from "./flood-warning-detail";

describe("fetching warning detail", () => {
  it("should succeed for valid warning id", async () => {
    try {
      const detail = await getFloodWarningDetail("IDQ10170");
      expect(detail.service).toBe("Public Weather Services");
      expect(detail.productType).toBe("Forecast");
      // the other values seem to be changing so I'll leave them for now
    } catch (e: any) {
      expect(true).toBe(false);
    }
  });
  it("should fail for invalid warning id", async () => {
    try {
      await getFloodWarningDetail("FAIL");
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toBe("invalid warningId");
    }
  });
  it("should fail for empty warning id", async () => {
    try {
      await getFloodWarningDetail("");
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toBe("invalid warningId");
    }
  });
});
