# sc-tool (shipping container tool)

`sc-tool` is the utility to easily operate shipping container data.

## Installation

```bash
npm install @lemon-samovar/sc-tool
```

## Usage

```typescript
import { Container, ContainerData } from '@lemon-samovar/sc-tool';

// you can create Container object like this:
const container1 = new Container('MSCU123456');
const checkDigit = container1.checkDigit
console.log(checkDigit); // output: `0`


// or like this:
const container2 = new Container({
    format: "full",
    ownerCode: "MSCU",
    serialNumber: 1234560,
    typeCode: "22K2"
});
const ownerInfo = container2.ownerInfo();
const typeInfo = container2.typeInfo();
console.log(ownerInfo);
console.log(typeInfo);
/* Output example:
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
*/

```
### `Container`

Creates a container instance from `ContainerData` type.

```typescript
new Container(data: string | FullContainerData | ShortContainerData);


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
    typeCode?: string
}
```



## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/)