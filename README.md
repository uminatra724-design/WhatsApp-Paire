# WhatsApp-Paire

WhatsApp pairing code tool & spam loop — Termux build.
Dibuat untuk Android (Termux) menggunakan Node.js dan `@whiskeysockets/baileys`.

> **Warning:** Pakai cuma ke nomor yang lo punya izin. Abuse = tanggung jawab lo.

## Requirements

- Termux (Android)
- Node.js >= 20
- Koneksi internet stabil

## Setup (Termux)

Jalankan perintah ini dari awal:

```bash
# 1. Update package & install Node.js
pkg update -y && pkg upgrade -y
pkg install nodejs git -y

# 2. Clone repository ini
git clone https://github.com/username/WhatsApp-Paire.git
cd WhatsApp-Paire

# 3. Install dependencies
# (gunakan --omit=optional agar tidak error saat install native modules)
npm install --omit=optional
