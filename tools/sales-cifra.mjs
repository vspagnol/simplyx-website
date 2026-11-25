// Cifra i contenuti di Simplyx Sales con utente e password, che NON stanno nel codice:
//   SALES_USER=... SALES_PASS=... node tools/sales-cifra.mjs
// Scrive src/sales/contenuti.enc.json (AES-256-GCM, chiave PBKDF2-SHA256). Va rilanciato a ogni modifica dei testi.
import { writeFileSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';
import { contenuti } from '../src/sales/contenuti.mjs';

const u = process.env.SALES_USER, p = process.env.SALES_PASS;
if (!u || !p) { console.error('Mancano SALES_USER e SALES_PASS (variabili d\'ambiente).'); process.exit(1); }
const ITER = 250000, enc = new TextEncoder(), b64 = (a) => Buffer.from(a).toString('base64');
const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey('raw', enc.encode(u.trim().toLowerCase() + ':' + p), 'PBKDF2', false, ['deriveBits']);
const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITER }, base, 256);
const key = await crypto.subtle.importKey('raw', bits, 'AES-GCM', false, ['encrypt']);
const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(contenuti())));
writeFileSync(new URL('../src/sales/contenuti.enc.json', import.meta.url), JSON.stringify({ v: 1, iter: ITER, salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(ct)) }) + '\n');
console.log('Contenuti cifrati: src/sales/contenuti.enc.json');
