#!/usr/bin/env node

import { Command } from "commander";
import { Container, Validator } from "../core";
import chalk from "chalk";
const program = new Command();

program
    .name('sc-tool')
    .description('A utility to easily operate shipping container data')
    .version('1.0.0');

program.command('validate')
    .description('Validate check-digit of a container number')
    .argument('<container-number>')
    .action((containerNumber: string) => {
        console.log('')
        containerNumber = containerNumber.trim().toUpperCase();
        const hasValidChars = /^[A-Z]{4}[0-9]{6,7}$/;
        if (containerNumber.length !== 11) {
            program.error(chalk.red.bold(`Error: Length of container number must be 11, not ${containerNumber.length}`));
        } else if (!hasValidChars.test(containerNumber)) {
            program.error(chalk.red.bold(`Error: Container number must only contain latin characters (a-z, A-Z) and arabic numerals (0-9)`));
        }
        const ownerCode = containerNumber.slice(0, 4);
        const serialNumber = containerNumber.slice(4, 10);
        const checkDigit = Number(containerNumber[10]);
        const valid = Validator.validate(ownerCode, serialNumber, checkDigit);
        if (valid) {
            console.log(chalk.green.bold(`✔`) + ` Container number ` + chalk.green(containerNumber) + ` is valid!`);
        } else {
            console.log(chalk.red.bold(`✘`)  + ` Container number ` + chalk.red(containerNumber) + ` is not valid! Correct check-digit is ` + chalk.yellow.underline.bold(Validator.calculate(ownerCode, serialNumber)))
        }
    });

program.command('type')
    .description('Get type information')
    .option('-n, --container-number <string>')
    .argument('<type-code>')
    .action((typeCode: string, options) => {
        const containerNumber = options.containerNumber ?? undefined;
        console.log('')
        try {
            const cont = new Container({
                format: "short",
                containerNumber: containerNumber ?? 'ABCU123456',
                typeCode: typeCode
            });
            const info = cont.getTypeInfo();
            console.log(chalk.green('> ' + (containerNumber ? containerNumber + ' ' : '') + typeCode.toUpperCase()));
            console.log('')
            if (containerNumber) {
                console.log(chalk.yellow('category: ') + info?.category);
            }
            console.log(chalk.yellow('type: ') + info?.type);
            console.log(chalk.yellow('length: ') + info?.length);
            console.log(chalk.yellow('height: ') + info?.height);
            console.log(chalk.yellow('width: ') + info?.width);
        } catch (err: any) {
            program.error(chalk.red(err));
        }
    });

program.command('owner')
    .description('Get container owner')
    .argument('<container-number>')
    .action((containerNumber: string) => {
        console.log('');
        try {
            const cont = new Container(containerNumber);
            const info = cont.getOwnerInfo();
            console.log(chalk.green('> ' + containerNumber.toUpperCase()));
            console.log('');
            if (info) {
                console.log(chalk.yellow('code: ') + info.code);
                console.log(chalk.yellow('company: ') + info.company);
                console.log(chalk.yellow('city: ') + info.city);
                console.log(chalk.yellow('country: ') + info.country);
            } else {
                console.log(chalk.yellow('✘ the owner was not found'));
            }
        } catch (err: any) {
            program.error(chalk.red(err));
        }
    });

program.parse();
