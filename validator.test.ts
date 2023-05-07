import { describe, it, expect } from "@jest/globals";
import { isValidCronExpression } from "./validator";


const VALID_EXPRESSIONS = ["0 * * * *", "5 0 * 8 *"];
const INVALID_EXPRESSIONS = ["10 32 232 433 ? 2043"];

describe("isValidCronExpression", () => {
    it("should only allow 5 or 6 expression fields", () => {
        expect(isValidCronExpression(" 0 0 ? * * 2023 ")).toBe(true)
        expect(isValidCronExpression("0 0 ? * * 2022")).toBe(true)
        expect(isValidCronExpression("0 0 ? * *")).toBe(true)
        expect(isValidCronExpression("0 0 0 0 0 0 0")).toBe(false)
        expect(isValidCronExpression("0 0")).toBe(false)
    })

    it("should only allow valid minute values", () => {
        expect(isValidCronExpression("0 0 ? * *")).toBe(true)
        expect(isValidCronExpression("59 0 ? * *")).toBe(true)
        expect(isValidCronExpression("60 0 ? * *")).toBe(false)
        expect(isValidCronExpression("-1 0 ? * *")).toBe(false)
    })

    it("should only allow valid hour values", () => {
        expect(isValidCronExpression("0 0 ? * *")).toBe(true)
        expect(isValidCronExpression("0 23 ? * *")).toBe(true)
        expect(isValidCronExpression("0 24 ? * *")).toBe(false)
        expect(isValidCronExpression("0 -1 ? * *")).toBe(false)
    })

    it("should only allow valid day of month values", () => {
        expect(isValidCronExpression("0 0 1 * *")).toBe(true)
        expect(isValidCronExpression("0 0 31 * *")).toBe(true)
        expect(isValidCronExpression("0 0 32 * *")).toBe(false)
        expect(isValidCronExpression("0 0 -1 * *")).toBe(false)
    })

    it("should only allow valid month values", () => {
        expect(isValidCronExpression("0 0 ? 1 *")).toBe(true)
        expect(isValidCronExpression("0 0 ? 12 *")).toBe(true)
        expect(isValidCronExpression("0 0 ? 13 *")).toBe(false)
        expect(isValidCronExpression("0 0 ? -1 *")).toBe(false)
    })

    it("should only allow valid day of week values", () => {
        expect(isValidCronExpression("0 0 ? * 0")).toBe(true)
        expect(isValidCronExpression("0 0 ? * 7")).toBe(true)
        expect(isValidCronExpression("0 0 ? * 8")).toBe(false)
        expect(isValidCronExpression("0 0 ? * -1")).toBe(false)
    })

    it("should only allow valid year values", () => {
        expect(isValidCronExpression("0 0 ? * * 1970")).toBe(true)
        expect(isValidCronExpression("0 0 ? * * 2199")).toBe(true)
        expect(isValidCronExpression("0 0 ? * * 2200")).toBe(false)
        expect(isValidCronExpression("0 0 ? * * -1")).toBe(false)
    })

    it("should allow ? as a valid day of month or day of week value", () => {
        expect(isValidCronExpression("0 0 ? * *")).toBe(true)
        expect(isValidCronExpression("0 0 * * ?")).toBe(true)
    })

    it("should allow * as a valid value", () => {
        expect(isValidCronExpression("* * * * *")).toBe(true)
    })

    it("should allow / as a valid value", () => {
        expect(isValidCronExpression("*/5 * * * *")).toBe(true)
        expect(isValidCronExpression("0 */5 * * *")).toBe(true)
        expect(isValidCronExpression("0 0 */5 * *")).toBe(true)
        expect(isValidCronExpression("0 0 0 */5 *")).toBe(true)
        expect(isValidCronExpression("0 0 0 0 */5")).toBe(true)
    })

    it("should allow , as a valid value", () => {
        expect(isValidCronExpression("0,5 * * * *")).toBe(true)
        expect(isValidCronExpression("0 0,5 * * *")).toBe(true)
        expect(isValidCronExpression("0 0 0,5 * *")).toBe(true)
        expect(isValidCronExpression("0 0 0 0,5 *")).toBe(true)
        expect(isValidCronExpression("0 0 0 0 0,5")).toBe(true)
    })

    it("should allow - as a valid value", () => {
        expect(isValidCronExpression("0-5 * * * *")).toBe(true)
        expect(isValidCronExpression("0 0-5 * * *")).toBe(true)
        expect(isValidCronExpression("0 0 0-5 * *")).toBe(true)
        expect(isValidCronExpression("0 0 0 0-5 *")).toBe(true)
        expect(isValidCronExpression("0 0 0 0 0-5")).toBe(true)
    })

    it("should allow L as a valid value", () => {
        expect(isValidCronExpression("0 0 L * *")).toBe(true)
        expect(isValidCronExpression("0 0 ? * L")).toBe(true)
    })

    it("should allow W as a valid value", () => {
        expect(isValidCronExpression("0 0 1W * *")).toBe(true)
        expect(isValidCronExpression("0 0 ? * 1W")).toBe(true)
    })

    it("should allow LW as a valid value", () => {
        expect(isValidCronExpression("0 0 LW * *")).toBe(true)
        expect(isValidCronExpression("0 0 ? * LW")).toBe(true)
    })

    it("should allow # as a valid value", () => {
        expect(isValidCronExpression("0 0 1#3 * *")).toBe(true)
        expect(isValidCronExpression("0 0 ? * 1#3")).toBe(true)
    })

    it("should allow L# as a valid value", () => {
        expect(isValidCronExpression("0 0 L#3 * *")).toBe(true)
        expect(isValidCronExpression("0 0 ? * L#3")).toBe(true)
    })

    it("should allow valid combinations of values", () => {
        for(const expression of VALID_EXPRESSIONS) {
            expect(isValidCronExpression(expression)).toBe(true)
        }
    })

    it("should not allow invalid combinations of values", () => {
        for(const expression of INVALID_EXPRESSIONS) {
            expect(isValidCronExpression(expression)).toBe(false)
        }
    })
})