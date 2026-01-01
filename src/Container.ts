import { lettersTable } from "./constants";
import type { ContainerData } from "./types";

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
            String(this.serialNumber).split("").forEach(element => sum += Number(element));
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
}