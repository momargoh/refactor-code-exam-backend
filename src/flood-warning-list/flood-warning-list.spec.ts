import { getFloodWarningList } from "./flood-warning-list";

describe("State query param", () => {
  it("should succeed for valid state", async () => {
    const warnings = await getFloodWarningList("QLD");
    expect(warnings.length).toBeGreaterThan(1);
  });
  it("should succeed for no state", async () => {
    const warnings = await getFloodWarningList("");
    expect(warnings.length).toBeGreaterThan(1);
  });
  it("should fail for invalid state", async () => {
    try {
      await getFloodWarningList("FAIL");
      // Fail test if above expression doesn't throw anything.
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toBe("invalid stateId");
    }
  });
});

describe("Find expected warnings", () => {
  it("should have warning id in list", async () => {
    const warnings = await getFloodWarningList("NSW");
    expect(warnings).toContain("IDN10016");
  });
  it("should have warning id in list", async () => {
    const warnings = await getFloodWarningList("TAS");
    expect(warnings).toContain("IDT12324");
  });
  // TODO continue test for all states
});
