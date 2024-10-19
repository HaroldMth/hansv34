const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');
const { handleCommand } = require('./main');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fonction pour poser une question dans la console
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const socket = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: state.keys,
        },
    });

    // Si le bot n'est pas enregistré, demandez le numéro de téléphone pour obtenir le code de couplage
    if (!socket.authState.creds.registered) {
        const phoneNumber = await question('Veuillez entrer votre numéro WhatsApp avec le code du pays (ex: +1234567890) : ');
        const code = await socket.requestPairingCode(phoneNumber);
        console.log(`Votre code de couplage : ${code.match(/.{1,4}/g).join('-')}`);
    }

    // Écoute des mises à jour de connexion
    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            console.log('Connexion fermée, tentative de reconnexion...');
            startBot(); // Tente de redémarrer le bot
        } else if (connection === 'open') {
            console.log('Connecté à WhatsApp !');
        }
    });

    // Écoute des messages
    socket.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const messageContent = msg.message.conversation || msg.message[Object.keys(msg.message)[0]].caption;
            if (messageContent.startsWith('.')) {
                const args = messageContent.trim().split(/ +/);
                const commandName = args.shift().slice(1).toLowerCase();
                await handleCommand(socket, msg, commandName, args);
            }
        }
    });

    socket.ev.on('creds.update', saveCreds);
}

startBot();
