import type { ContainerData, ContainerTypeData, ContainerOwnerData } from "./types";
import _typeCodes from "../data/type-codes.json";
import _sizeCodesFirstChar from "../data/size-codes-1char.json";
import _sizeCodesSecondChar from "../data/size-codes-2char.json";
import _categoryIdentifiers from "../data/category-identifier.json";
import _bicCodes from "../data/bic-codes.json";
import { 
    InvalidContainerNumberError,
    InvalidOwnerCodeError,
    InvalidSerialNumberError,
    InvalidTypeCodeError
 } from "../src/errors";
import { Validator } from "./Validator";

const typeCodes = _typeCodes as {[index: string]: string}
const sizeCodesFirstChar = _sizeCodesFirstChar as {[index: string]: string}
const sizeCodesSecondChar = _sizeCodesSecondChar as {[index: string]: {height: string, width: string}}
const categoryIdentifiers = _categoryIdentifiers as {[index: string]: string}
const bicMap = new Map(_bicCodes.map(item => [item.code, item]));

export class Container {
    readonly ownerCode: string;
    readonly serialNumber: number | string;
    readonly checkDigit: number | string;
    readonly typeCode: string;
    
    constructor(data: ContainerData) {
        if (typeof data !== "string" && data.format === "short") {
            const fmtContNum = data.containerNumber.trim().toUpperCase();
            if (fmtContNum.length < 10 || fmtContNum.length > 11) {
                throw new InvalidContainerNumberError(`Length of number must be 10 or 11, not ${fmtContNum.length}`);
            }
            const hasLetters = /^[A-Z]{4}$/;
            if (!hasLetters.test(fmtContNum.slice(0, 4))) {
                throw new InvalidOwnerCodeError(`Code must only contain latin characters (a-z, A-Z)`);
            }
            this.ownerCode = fmtContNum.slice(0, 4);
            const hasNumbers = /^[0-9]{6,7}$/;
            if (!hasNumbers.test(fmtContNum.slice(4))) {
                throw new InvalidSerialNumberError(`Number must only contain arabic numerals (0-9)`);
            }
            this.serialNumber = fmtContNum.slice(4, 10);
            this.checkDigit = fmtContNum[10] ?? Validator.calculate(this.ownerCode, this.serialNumber);
            const fmtTypeCode = data.typeCode?.trim().toUpperCase();
            const hasValidChars = /^[A-Z][0-9]{4}$/;
            if (fmtTypeCode && fmtTypeCode.length !== 4) {
                throw new InvalidTypeCodeError(`Length of code must be 4, not ${fmtTypeCode.length}`);
            } else if (fmtTypeCode && !hasValidChars.test(fmtTypeCode)) {
                throw new InvalidTypeCodeError(`Code must only contain latin characters (a-z, A-Z) and arabic numerals (0-9)`);
            }
            this.typeCode = fmtTypeCode ?? '';
        } else if (typeof data === "string") {
            const fmtContNum = data.trim().toUpperCase();
            const hasValidChars = /^[A-Z]{4}[0-9]{6,7}$/;
            if (fmtContNum.length < 10 || fmtContNum.length > 11) {
                throw new InvalidContainerNumberError(`Length of number must be 10 or 11, not ${fmtContNum.length}`);
            } else if (!hasValidChars.test(fmtContNum)) {
                throw new InvalidContainerNumberError(`Number must only contain latin characters (a-z, A-Z) and arabic numerals (0-9)`);
            }
            this.ownerCode = fmtContNum.slice(0, 4);
            this.serialNumber = fmtContNum.slice(4, 10);
            this.checkDigit = fmtContNum[10] ?? Validator.calculate(this.ownerCode, this.serialNumber);
            this.typeCode = '';
        } else {
            const fmtOwnerCode = data.ownerCode.trim().toUpperCase();
            const hasLetters = /^[A-Z]{4}$/;
            if (fmtOwnerCode.length !== 4) {
                throw new InvalidOwnerCodeError(`Length of code must be 4, not ${fmtOwnerCode.length}`);
            } else if (!hasLetters.test(fmtOwnerCode)) {
                throw new InvalidOwnerCodeError(`Code must only contain latin characters (a-z, A-Z)`);
            }
            this.ownerCode = fmtOwnerCode;
            const hasNumbers = /^[0-9]{6,7}$/;
            if (data.serialNumber.toString().length < 6 || data.serialNumber.toString().length > 7) {
                throw new InvalidSerialNumberError(`Length of number must be 6 or 7, not ${data.serialNumber.toString().length}`);
            } else if (!hasNumbers.test(data.serialNumber.toString())) {
                throw new InvalidSerialNumberError(`Number must only contain arabic numerals (0-9)`);
            }
            this.serialNumber = data.serialNumber;
            this.checkDigit = data.checkDigit ?? Validator.calculate(this.ownerCode, this.serialNumber);
            const fmtTypeCode = data.typeCode?.trim().toUpperCase();
            const hasValidChars = /^[A-Z][0-9]{4}$/;
            if (fmtTypeCode && fmtTypeCode.length !== 4) {
                throw new InvalidTypeCodeError(`Length of code must be 4, not ${fmtTypeCode.length}`);
            } else if (fmtTypeCode && !hasValidChars.test(fmtTypeCode)) {
                throw new InvalidTypeCodeError(`Code must only contain latin characters (a-z, A-Z) and arabic numerals (0-9)`);
            }
            this.typeCode = fmtTypeCode ?? '';
        }
    }    

    fullContainerNumber(): string {
        const ownerCode = this.ownerCode ? this.ownerCode : 'XXXX';
        const serialNumber = this.serialNumber ? this.serialNumber : 'XXXXXX';
        const checkDigit = this.checkDigit ? this.checkDigit : 'X';
        return ownerCode + serialNumber + checkDigit
    }
    
    typeInfo(): ContainerTypeData | null {
        if (this.typeCode) {
            const type: string = this.typeCode.slice(2, 4);
            const sizeFirstChar = this.typeCode[0];
            const sizeSecondChar = this.typeCode[1];
            const categoryIdentifier = this.ownerCode[3];

            return {
                category: categoryIdentifiers[categoryIdentifier],
                type: typeCodes[type],
                width: sizeCodesFirstChar[sizeFirstChar],
                length: sizeCodesSecondChar[sizeSecondChar]['width'],
                height: sizeCodesSecondChar[sizeSecondChar]['height']
            }
        } else {
            return null
        }
    }

    ownerInfo(): ContainerOwnerData | null {
        if (!this.ownerCode) return null;
        const entry = bicMap.get(this.ownerCode);
        if (!entry) return null;
        else return entry
    }
}