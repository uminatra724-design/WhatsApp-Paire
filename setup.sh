#!/data/data/com.termux/files/usr/bin/bash
# setup wa-pairspam di termux
set -e

echo "[*] update packages..."
pkg update -y && pkg upgrade -y

echo "[*] install nodejs..."
pkg install nodejs git -y

echo "[*] node version:"
node -v

echo "[*] install dependencies..."
npm install --omit=optional

echo "[*] syntax check..."
node --check pairspam.js

echo "[+] setup selesai. jalanin: node pairspam.js"