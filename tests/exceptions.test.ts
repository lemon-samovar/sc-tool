import { test, expect } from "@jest/globals";
import { Container, Validator } from "../src";
import { InvalidContainerNumberError, InvalidOwnerCodeError, InvalidSerialNumberError, InvalidTypeCodeError } from "../src";

test('exceptions for invalid container number', () => {
    expect(() => {
        const cont = new Container("ABCU12345678"); // wrong length
    }).toThrow(InvalidContainerNumberError);
    expect(() => {
        const cont = new Container("集装箱U123456"); // invalid chars
    }).toThrow(InvalidContainerNumberError);
});

test('exceptions for invalid owner code', () => {
    expect(() => {
        const cont = new Container({
            format: "full",
            ownerCode: "集装箱U",
            serialNumber: 123456
        });                                         // invalid chars
    }).toThrow(InvalidOwnerCodeError);
    expect(() => {
        const cont = new Container({
            format: "full",
            ownerCode: "OPQRU",
            serialNumber: 123456
        });                                         // invalid length
    }).toThrow(InvalidOwnerCodeError);
    expect(() => {
        Validator.calculate("集装箱Ъ", "123456");    // invalid chars
    }).toThrow(InvalidOwnerCodeError);
    expect(() => {
        Validator.calculate("ABCDE", "123456");     // invalid length
    }).toThrow(InvalidOwnerCodeError);
});


test('exceptions for invalid serial number', () => {
    expect(() => {
        const cont = new Container({
            format: "full",
            ownerCode: "ABCU",
            serialNumber: "1234ぁ6"
        });                                         // invalid chars
    }).toThrow(InvalidSerialNumberError);
    expect(() => {
        const cont = new Container({
            format: "full",
            ownerCode: "OPQR",
            serialNumber: "12345678"
        });                                         // invalid length
    }).toThrow(InvalidSerialNumberError);
    expect(() => {
        Validator.calculate("ABCU", "1Й34ぁ6");     // invalid chars
    }).toThrow(InvalidSerialNumberError);
    expect(() => {
        Validator.calculate("ABCU", "12345678");    // invalid length
    }).toThrow(InvalidSerialNumberError);
});

test('exceptions for invalid type code', () => {
    expect(() => {
        const cont = new Container({
            format: "short",
            containerNumber: "ABCU123456",
            typeCode: "22TT22"
        });                                          // invalid length
    }).toThrow(InvalidTypeCodeError);
    expect(() => {
        const cont = new Container({
            format: "short",
            containerNumber: "ABCU123456",
            typeCode: "45Я1"
        });                                          // invalid chars
    }).toThrow(InvalidTypeCodeError);
})