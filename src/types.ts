interface FullContainerData {
    format: "full",
    ownerCode: string,
    categoryIdentifier: string, 
    serialNumber: number | string, 
    checkDigit?: number | string,
    typeCode?: string,
}

interface ShortContainerData {
    format: "short",
    containerNumber: string,
    typeCode?: string
}

export type ContainerData =
    | string
    | FullContainerData
    | ShortContainerData