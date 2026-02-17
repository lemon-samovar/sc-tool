import { lettersTable } from "./constants";
import type { ContainerData, ContainerTypeData, ContainerOwnerData } from "./types";
import _typeCodes from "../data/type-codes.json";
import _sizeCodesFirstChar from "../data/size-codes-1char.json";
import _sizeCodesSecondChar from "../data/size-codes-2char.json";
import _categoryIdentifiers from "../data/category-identifier.json";
import _bicCodes from "../data/bic-codes.json";

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
        if (typeof data !== "string" && (data.format === "short")) {
            const fmtContNum = data.containerNumber.trim().toUpperCase();
            this.ownerCode = fmtContNum.slice(0, 4);
            this.serialNumber = fmtContNum.slice(4, 10);
            this.checkDigit = fmtContNum[10] ?? this.calculateCheckDigit();
            this.typeCode = data.typeCode?.trim().toUpperCase() ?? '';
        } else if (typeof data === "string") {
            const fmtContNum = data.trim().toUpperCase();
            this.ownerCode = fmtContNum.slice(0, 4);
            this.serialNumber = fmtContNum.slice(4, 10);
            this.checkDigit = fmtContNum[10] ?? this.calculateCheckDigit();
            this.typeCode = '';
        } else {
            this.ownerCode = data.ownerCode.trim().toUpperCase();
            this.serialNumber = data.serialNumber;
            this.checkDigit = data.checkDigit ?? this.calculateCheckDigit();
            this.typeCode = data.typeCode?.trim().toUpperCase() ?? '';
        }
    }    

    calculateCheckDigit(): number {
        const ownerCode = [...this.ownerCode];
        let sum = 0;
        ownerCode.forEach((letter, idx) => {
            sum += lettersTable[letter] * 2**idx;
        });
        String(this.serialNumber).split("").forEach((element, idx) => {
            sum += Number(element) * 2**(idx+4)
        });
        return sum % 11 == 10 ? 0 : sum % 11
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