#!/usr/bin/env node
/**
 * Prepares Android assets for CI/local Gradle build without relying on cap CLI.
 */
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'android', 'app', 'src', 'main', 'assets');
const publicDir = join(assets, 'public');

mkdirSync(publicDir, { recursive: true });
cpSync(join(root, 'www'), publicDir, { recursive: true });
cpSync(
  join(root, 'node_modules', '@capacitor', 'core', 'cordova.js'),
  join(publicDir, 'cordova.js')
);
writeFileSync(join(publicDir, 'cordova_plugins.js'), '');
cpSync(join(root, 'capacitor.config.json'), join(assets, 'capacitor.config.json'));
writeFileSync(
  join(assets, 'capacitor.plugins.json'),
  JSON.stringify(
    [
      {
        pkg: '@capacitor/splash-screen',
        classpath: 'com.capacitorjs.plugins.splashscreen.SplashScreenPlugin',
      },
      {
        pkg: '@capacitor/status-bar',
        classpath: 'com.capacitorjs.plugins.statusbar.StatusBarPlugin',
      },
    ],
    null,
    '\t'
  ) + '\n'
);

console.log('Android CI assets prepared.');
