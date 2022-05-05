#! /usr/bin/env node

const program = require('commander');
const fs = require('fs');
const { type } = require('os');
const path = require('path');

const dir = process.cwd()

program
    .version(require('../package.json').version)
    .usage('<path> [options]')
    .parse(process.argv);

if (program.args.length === 0) {
    console.log('No path specified');
    process.exit()
}

// console.log(program.args);

// filename can only be a directory
const filename = program.args[0];

// read the file

const filePath = path.join(process.cwd(), filename);
let destFilePath = path.join(process.cwd(), filename + "-backup");

console.log('read it, ', filePath, destFilePath);
console.log('it\'s exist, ', fs.existsSync(filePath));

const copy = (source, destination) => {
    // File destination.txt will be created or overwritten by default.
    fs.copyFile(source, destination, (err) => {
        if (err) throw err;
        console.log('source was copied to destination');
    });
}

const isDirectory = (path_string) => {
    return fs.lstatSync(path_string).isDirectory()
}


const main = (filePath, destFilePath) => {
    if (!fs.existsSync(filePath))
        return console.log('filepath is not exist')
    const files = fs.readdirSync(filePath)

    for (let file of files) {
        if (file === 'node_modules') continue; // don't need copy it

        const childFilePath = path.join(filePath, file)
        const destChildFilePath = path.join(destFilePath, file)

        if (isDirectory(childFilePath)) {
            fs.mkdirSync(destChildFilePath)
            main(childFilePath, path.join(destFilePath, file))
            continue;
        }

        copy(childFilePath, destChildFilePath)
        console.log('copy childFilePath', childFilePath)
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


const renamePath = (destFilePath) => {
    while (fs.existsSync(destFilePath)) {
        // rename file
        destFilePath = path.join(process.cwd(), filename + "-" + getRandomInt(1000, 9999) + "-backup");
    }
    return destFilePath
}


if (!isDirectory(filePath)) {
    // it is not directory
    copy(filePath, destFilePath)
    process.exit(1)
}

// it ensure the filename dont't exist
destFilePath = renamePath(destFilePath)

fs.mkdirSync(destFilePath)
main(filePath, destFilePath)