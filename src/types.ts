export interface FullContainerData {
    format: "full",
    ownerCode: string,
    serialNumber: number | string, 
    checkDigit?: number | string,
    typeCode?: string,
}

export interface ShortContainerData {
    format: "short",
    containerNumber: string,
    typeCode?: string
}

export type ContainerData =
    | string
    | FullContainerData
    | ShortContainerData

export interface ContainerTypeData {
    category: string, 
    type: string, 
    width: string, 
    length: string, 
    height: string
}

export interface ContainerOwnerData {
    code: string,
    company: string,
    city: string,
    country: string
}