import { lettersTable } from "./constants";
import { InvalidOwnerCodeError, InvalidSerialNumberError } from "./errors";

export class Validator {
    static calculate(ownerCode: string, serialNumber: string | number): number {
        ownerCode = ownerCode.trim().toUpperCase();
        const hasLetters = /^[A-Z]{4}$/;
        if (ownerCode.length !== 4) {
            throw new InvalidOwnerCodeError(`Length of code must be 4, not ${ownerCode.length}`);
        } else if (!hasLetters.test(ownerCode)) {
            throw new InvalidOwnerCodeError(`Code must only contain latin characters (a-z, A-Z)`);
        }
        serialNumber = serialNumber.toString().trim().toUpperCase();
        const hasNumbers = /^[0-9]{6,7}$/;
        if (serialNumber.length < 6 || serialNumber.length > 7) {
            throw new InvalidSerialNumberError(`Length of number must be 6 or 7, not ${serialNumber.length}`);
        } else if (!hasNumbers.test(serialNumber)) {
            throw new InvalidSerialNumberError(`Number must only contain arabic numerals (0-9)`);
        }
        const ownerCodeLetters = [...ownerCode];
        let sum = 0;
        ownerCodeLetters.forEach((letter, idx) => {
            sum += lettersTable[letter] * 2**idx;
        });
        serialNumber.split("").forEach((element, idx) => {
            sum += Number(element) * 2**(idx+4)
        });
        const result = sum % 11 === 10 ? 0 : sum % 11;
        return result
    }
    
    static validate(ownerCode: string, serialNumber: string | number, checkDigit: number): boolean {
        const result = this.calculate(ownerCode, serialNumber);
        return result === checkDigit
    }
}