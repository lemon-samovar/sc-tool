[![Node.js Package](https://github.com/lemon-samovar/sc-tool/actions/workflows/npm-publish-github-packages.yml/badge.svg)](https://github.com/lemon-samovar/sc-tool/actions/workflows/npm-publish-github-packages.yml)
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](#)
# sc-tool (shipping container tool)

`sc-tool` is the utility to easily operate shipping container data.

## Table of Contents
 - [Installation](#installation)
 - [Usage](#usage)
    - [Package](#package)
    - [CLI](#cli)
 - [API](#api)
    - [Container](#container)
    - [Validator](#validator)
 - [CLI](#cli-1)
    - [validate](#validate)
    - [type](#type)
    - [owner](#owner)
  - [Contributing](#contributing)
  - [License](#license)


## Installation

```bash
npm install @lemon-samovar/sc-tool
```
or
```bash
npm install -g @lemon-samovar/sc-tool
```
if you will use package as a global cli command
## Usage
### Package:
```ts
import { Container } from '@lemon-samovar/sc-tool';

const container = new Container({
    format: "full",
    ownerCode: "MSCU",
    serialNumber: 1234560,
    typeCode: "22K2"
});
const ownerInfo = container.ownerInfo();
const typeInfo = container.typeInfo();
console.log(ownerInfo);
console.log(typeInfo);
```
Output:
```bash
{
  code: 'MSCU',
  company: 'MSC- MEDITERRANEAN SHIPPING COMPANY S.A.',
  city: 'GENEVE',
  country: 'Switzerland'
}
{
  category: 'Freigth container',
  type: 'Pressurised tank container (liquids and gases) — liquid tank dangerous goods > 265 kPa and ≤ 1000 kPa pressure',
  width: '6068 mm (20 ft)',
  length: '2438 mm (8 ft)',
  height: '2591 mm (8,5 ft)'
}
```
### CLI:
```bash
$ sc-tool owner CICU1234560

> CICU1234567

code: CICU
company: CIMC CONTAINERS HOLDING COMPANY LTD
city: GUANGDONG
country: China

$ sc-tool type 22G1

> 22G1

type: General purpose container without ventilation — passive vents at upper part of cargo space
length: 2438 mm (8 ft)
height: 2591 mm (8,5 ft)
width: 6068 mm (20 ft)
```
## API

### `Container`
```ts
// ESM
import { Container } from '@lemon-samovar/sc-tool';
```
```js
// CommonJS
const { Container } = require('@lemon-samovar/sc-tool');
```
#### `new Container(data: ContainerData)`

Creates a container instance from `ContainerData` type.
```ts
type ContainerData =
    | string
    | FullContainerData
    | ShortContainerData

interface FullContainerData {
    format: "full",
    ownerCode: string,
    serialNumber: number | string, 
    checkDigit?: number | string,
    typeCode?: string,
}

interface ShortContainerData {
    format: "short",
    containerNumber: string,
    checkDigit?: number | string,
    typeCode?: string
}
```

If check-digit is not provided, it will be calculated from the serial number and owner's bic-code.
`Example:`
```ts
const cont = new Container("ABCU123456");
console.log(`Calculated check-digit: ${cont.checkDigit}`);
```
```bash
Calculated check-digit: 0
```

#### `container.getContainerNumber(): string`
Returns full container number.

*Example:*
```ts
const containerNumber = container.getContainerNumber();
console.log(`Full container number: ${containerNumber}`);
```
```bash
Full container number: ABCU1234560
```

#### `container.getFullMarking(): ContainerInfo`
Returns all avaliable container markings.
```ts
interface ContainerInfo {
    ownerCode: string;
    serialNumber: string;
    checkDigit: number;
    typeCode: string;
}
```

*Example:*
```ts
const cont = new Container({
  format: "short",
  containerNumber: "ABCU123456",
  typeCode: "22K2"
});
const result = cont.getFullMarking();
console.log(result);
```
```bash
{
  ownerCode: 'ABCU',
  serialNumber: '123456',
  checkDigit: 0,
  typeCode: '22K2'
}
```

#### `container.getTypeInfo(): ContainerDataType | null`
Returns container type information by type code and category identifier. Returns `null` if type code is not provided.
```ts
interface ContainerTypeData {
    category: string, 
    type: string, 
    width: string, 
    length: string, 
    height: string
}
```
*Example:*
```ts
const cont = new Container({
  format: "full",
  ownerCode: "RKNU",
  serialNumber: "1234560",
  typeCode: "45R1"
});
const info = cont.getTypeInfo();
console.log(info);
```
```bash
{
  category: 'Freigth container',
  type: 'Thermal container — mechanically refrigerated and heated',
  width: '12192 mm (40 ft)',
  length: '2438 mm (8 ft)',
  height: '2895 mm (9,5 ft)'
}
```
#### `container.getOwnerInfo(): ContainerOwnerData | null`
Returns information about the owner of the container by owner's bic-code. Returns `null` if owner's bic-code is not provided or was not found.
```ts
interface ContainerOwnerData {
    code: string,
    company: string,
    city: string,
    country: string
}
```
*Example:*
```ts
const cont = new Container("FCCU1234560");
const info = cont.getOwnerInfo();
console.log(info);
```
```bash
{
  code: 'FCCU',
  company: 'FAR EASTERN SHIPPING PLC',
  city: 'VLADIVOSTOK',
  country: 'Russian Federation'
}
```
#### `container.ownerCode: string`
A container owner's bic-code. The field is read-only.
#### `container.serialNumber: string`
A container serial number. The field is read-only.
#### `container.checkDigit: number`
A container number check-digit. Auto-calculated in `Container` class constructor by owner's bic-code and container serial number. The field is read-only.
#### `container.typeCode: string`
A container type code. An empty string if the type code is not provided. The field is read-only.


### `Validator`
```ts
// ESM
import { Validator } from '@lemon-samovar/sc-tool';
```
```js
// CommonJS
const { Validator } = require('@lemon-samovar/sc-tool');
```
#### `Validator.calculate(ownerCode: string, serialNumber: string | number): number`
Calculates check-digit by bic-code and container serial number. The method is static.

*Example:*
```ts
const checkDigit = Validator.calculate("ABCU", "894512");
console.log(`Calculated check-digit: ${checkDigit}`);
```
```bash
Calculated check-digit: 8
```

#### `Validator.validate(ownerCode: string, serialNumber: string | number, checkDigit: number): boolean`
Validates a container number check-digit by bic-code and container serial number. The method is static.

*Example:*
```ts
const checkDigit = Validator.calculate("ABCU", 894512);
const falseCheckDigit = 7;

const isValid = Validator.validate("ABCU", 894512, falseCheckDigit);

console.log(isValid);
console.log(`Given check-digit: ${falseCheckDigit}`)
console.log(`Correct check-digit: ${checkDigit}`)
```
```bash
false
Given check-digit: 7
Correct check-digit: 8
```

## CLI
`sc-tool` may also be used as a cli tool:
```bash
$ sc-tool
```
```bash
Usage: sc-tool [options] [command]

A utility to easily operate shipping container data

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  validate <container-number>  Validate check-digit of a container number
  type [options] <type-code>   Get type information
  owner <container-number>     Get container owner
  help [command]               display help for command
```
### `validate`
Validates check-digit of a container number.

*Example:*
```bash
$ sc-tool validate ABCU1234560
```
```bash

✔ Container number ABCU1234560 is valid!
            
```
```bash
$ sc-tool validate ABCU1234569
```
```bash

✘ Container number ABCU1234569 is not valid! Correct check-digit is 0
  
```
### `type`
Returns container type information by type code. May also return a container category by category identifier if container number is provided. To pass it, use `--container-number` or `-n` flag.

*Example:*
```bash
$ sc-tool type 22T2
```
```bash

> 22T2

type: Tank container — nondangerous liquids, minimum pressure 265 kPa
length: 2438 mm (8 ft)
height: 2591 mm (8,5 ft)
width: 6068 mm (20 ft)
          
```
```bash
$ sc-tool type -n ABCU123456 22G2
```
```bash

> ABCU123456 22G2

category: Freigth container
type: General purpose container without ventilation — opening(s) at one or both ends + "full" opening(s) on one or both sides
length: 2438 mm (8 ft)
height: 2591 mm (8,5 ft)
width: 6068 mm (20 ft)
                  
```

### `owner`
Returns owner information by container number.

*Example:*
```bash
$ sc-tool owner RKNU1234560
```
```bash

> RKNU1234560

code: RKNU
company: ROKONORD LTD
city: SAINT PETERSBOURG
country: Russian Federation
     
```
## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/)