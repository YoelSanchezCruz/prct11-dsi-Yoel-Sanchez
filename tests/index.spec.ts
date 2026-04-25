import { describe, expect, test } from "vitest";
import { add } from "../src/index.js";

describe("add function tests", () => {
  test("add(1, 8) returns the value 9", () => {
    expect(add(1,8)).toBe(9);
  })
});