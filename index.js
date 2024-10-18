const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const { handleCommand } = require('./main');

// Démarrer le bot
const prefix = '.';
const connectToWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const client = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    client.ev.on('creds.update', saveCreds);

    client.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut);
            console.log('connexion fermée. Reconnexion : ', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Connecté à WhatsApp');
        }
    });

    client.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const messageContent = msg.message.conversation || msg.message[Object.keys(msg.message)[0]].caption;
            if (messageContent.startsWith(prefix)) {
                const args = messageContent.trim().split(/ +/);
                const commandName = args.shift().slice(prefix.length).toLowerCase();
                await handleCommand(client, msg, commandName, args);
            }
        }
    });
};

connectToWhatsApp();
