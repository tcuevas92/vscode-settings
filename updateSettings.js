#!/usr/bin/env node
const fs = require('fs');

const userSettingsLocation = `${process.env.APPDATA}\\Code\\User\\settings.json`;
const sharedSettingsLocation = './settings.json';

console.log('Checking if user settings already exist...');
if (fs.existsSync(userSettingsLocation)) {
    backupSettings();
    mergeSettings();
} else {
    console.log('No user settings were found. Updating to use shared settings...');
    const sharedSettings = getSettingsJson(sharedSettingsLocation);
    fs.writeFileSync(userSettingsLocation, JSON.stringify(sharedSettings));
}
console.log('Done');

function mergeSettings() {
    console.log('Merging settings...');
    const existingSettings = getSettingsJson(userSettingsLocation);
    const sharedSettings = getSettingsJson(sharedSettingsLocation);
    const newSettings = {
        ...sharedSettings,
        ...existingSettings
    };
    fs.writeFileSync(userSettingsLocation, JSON.stringify(newSettings, null, '\t'));
}

function backupSettings() {
    const backupLocation = `${process.env.APPDATA}\\Code\\User\\settings.backup.json`;
    console.log(`Existing settings were found. Creating a backup of your previous settings at ${backupLocation}...`);
    fs.copyFileSync(userSettingsLocation, backupLocation)
}

function getSettingsJson(filePath) {
    const settingsFile = fs.readFileSync(filePath);
    return JSON.parse(settingsFile);
}