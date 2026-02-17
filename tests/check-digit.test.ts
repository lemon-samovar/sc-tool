import { test, expect } from '@jest/globals';
import { Container } from '../src';

test('calculates check digit for MSCU123456 to equal 6', () => {
    const ct1 = new Container("MSCU123456");
    const ct1_full = new Container({
        format: "full",
        ownerCode: "MSCU",
        serialNumber: 123456
    });
    const ct1_short = new Container({
        format: "short",
        containerNumber: "MSCU123456"
    });

    expect(ct1.checkDigit).toBe(6);
    expect(ct1_full.checkDigit).toBe(6);
    expect(ct1_short.checkDigit).toBe(6);
});

test('calculates check digit for AAAU894134 to equal 4', () => {
    const ct2 = new Container("AAAU894134");
    const ct2_full = new Container({
        format: "full",
        ownerCode: "AAAU",
        serialNumber: 894134
    });
    const ct2_short = new Container({
        format: "short",
        containerNumber: "AAAU894134"
    });

    expect(ct2.checkDigit).toBe(4);
    expect(ct2_full.checkDigit).toBe(4);
    expect(ct2_short.checkDigit).toBe(4);
});

test('calculates check digit for WXYZ000000 to equal 9', () => {
    const ct3 = new Container("WXYZ000000");
    const ct3_full = new Container({
        format: "full",
        ownerCode: "WXYZ",
        serialNumber: "000000"
    });
    const ct3_short = new Container({
        format: "short",
        containerNumber: "WXYZ000000"
    });

    expect(ct3.checkDigit).toBe(9);
    expect(ct3_full.checkDigit).toBe(9);
    expect(ct3_short.checkDigit).toBe(9);
});

test('calculates check digit for OBWJ941343 to equal 0', () => {
    const ct4 = new Container("ObWj941343");
    const ct4_full = new Container({
        format: "full",
        ownerCode: "oBWj",
        serialNumber: 941343
    });
    const ct4_short = new Container({
        format: "short",
        containerNumber: "ObwJ941343"
    });

    expect(ct4.checkDigit).toBe(0);
    expect(ct4_full.checkDigit).toBe(0);
    expect(ct4_short.checkDigit).toBe(0);
});

test('calculates check digit for ABVU123456 to equal 7', () => {
    const ct5 = new Container(" abvu123456");
    const ct5_full = new Container({
        format: "full",
        ownerCode: "abvu ",
        serialNumber: 123456
    });
    const ct5_short = new Container({
        format: "short",
        containerNumber: " abvu123456 "
    });

    expect(ct5.checkDigit).toBe(7);
    expect(ct5_full.checkDigit).toBe(7);
    expect(ct5_short.checkDigit).toBe(7);
});
