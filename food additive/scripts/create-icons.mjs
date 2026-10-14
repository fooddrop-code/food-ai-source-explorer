import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const source = await readFile(new URL('../src/Illustrations.tsx', import.meta.url), 'utf8');
// Use the same source vector shapes as the in-app mascot; preserve its design.
const body = source.slice(source.indexOf('<Ellipse'), source.indexOf('</Svg>')).replace(/strokeWidth/g, 'stroke-width').replace(/strokeLinecap/g, 'stroke-linecap').replace(/strokeLinejoin/g, 'stroke-linejoin').replace(/fillOpacity/g, 'fill-opacity');
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" rx="220" fill="#F9E7E9"/><g transform="translate(52 34) scale(4.6)">${body}</g></svg>`;
await writeFile(new URL('../assets/mogu-icon.svg', import.meta.url), icon);
await sharp(Buffer.from(icon)).png().toFile(new URL('../assets/mogu-icon.png', import.meta.url).pathname.replace(/^\/(?:([A-Z]:))/, '$1'));
await sharp(Buffer.from(icon)).resize(64,64).png().toFile(new URL('../assets/mogu-favicon.png', import.meta.url).pathname.replace(/^\/(?:([A-Z]:))/, '$1'));
console.log('Created Mogu app icons');
