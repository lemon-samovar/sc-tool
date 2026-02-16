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
    readonly categoryIdentifier: string;
    readonly serialNumber: number | string;
    readonly checkDigit: number | string;
    readonly typeCode: string;
    
    constructor(data: ContainerData) {
        if (typeof data !== "string" && (data.format === "short")) {
            this.ownerCode = data.containerNumber.slice(0, 4);
            this.categoryIdentifier = data.containerNumber[4];
            this.serialNumber = data.containerNumber.slice(5, 11);
            this.checkDigit = data.containerNumber[11] ?? this.calculateCheckDigit();
            this.typeCode = data.typeCode ?? '';
        } else if (typeof data === "string") {
            this.ownerCode = data.slice(0, 4);
            this.categoryIdentifier = data[4];
            this.serialNumber = data.slice(5, 11);
            this.checkDigit = data[11] ?? this.calculateCheckDigit();
            this.typeCode = '';
        } else {
            this.ownerCode = data.ownerCode;
            this.categoryIdentifier = data.categoryIdentifier;
            this.serialNumber = data.serialNumber;
            this.checkDigit = data.checkDigit ?? this.calculateCheckDigit();
            this.typeCode = data.typeCode ?? "";
        }
    }    

    calculateCheckDigit(): number | string {
        if (this.ownerCode && this.categoryIdentifier && this.serialNumber) {
            const ownerCodeAndCategoryIdentifier = [...(this.ownerCode + this.categoryIdentifier)];
            let sum = 0;
            ownerCodeAndCategoryIdentifier.forEach((letter, idx) => {
                sum += lettersTable[letter] * 2**idx;
            });
            String(this.serialNumber).split("").forEach((element, idx) => {
                sum += Number(element) * 2**(idx+4)
            });
            return sum % 11 == 10 ? 0 : sum % 11
        } else {
            return ''
        }
    }

    fullContainerNumber(): string {
        const ownerCode = this.ownerCode ? this.ownerCode : 'XXX';
        const categoryIdentifier = this.categoryIdentifier ? this.categoryIdentifier : 'X';
        const serialNumber = this.serialNumber ? this.serialNumber : 'XXXXXX';
        const checkDigit = this.checkDigit ? this.checkDigit : 'X';
        return (ownerCode + categoryIdentifier + serialNumber + checkDigit).toUpperCase()
    }
    
    typeInfo(): ContainerTypeData | null {
        if (this.typeCode && this.categoryIdentifier) {
            const type: string = this.typeCode.slice(0, 2);
            const sizeFirstChar = this.typeCode[2];
            const sizeSecondChar = this.typeCode[3];

            return {
                category: categoryIdentifiers[this.categoryIdentifier],
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