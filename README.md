# wa-pairspam

WhatsApp pairing code spam loop — Termux build.
Loop request pairing code ke nomor target, tiap iterasi fresh socket + fresh auth folder.

> **Warning:** pakai cuma ke nomor yang lo punya izin. Abuse = tanggung jawab lo.

## Requirements

- Termux (Android)
- Node.js >= 20

## Setup

```bash
pkg update -y && pkg upgrade -y
pkg install nodejs git -y
git clone <repo-url>
cd wa-pairspam
npm install --omit=optional