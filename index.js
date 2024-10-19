require('./settings')
const makeWASocket = require("@whiskeysockets/baileys").default;
const { uncache, nocache } = require('./lib/loader');
const { color } = require('./lib/color');
const NodeCache = require("node-cache");
const readline = require("readline");
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const { Low, JSONFile } = require('./lib/lowdb');
const yargs = require('yargs/yargs');
const fs = require('fs');
const chalk = require('chalk');
const { makeInMemoryStore, jidNormalizedUser, Browsers } = require("@whiskeysockets/baileys");

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.db = new Low(new JSONFile(`src/database.json`));

global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () {
    (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null);
  }, 1 * 1000));

  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read();
  global.db.READ = false;
  global.db.data = {
    users: {},
    database: {},
    chats: {},
    game: {},
    settings: {},
    message: {},
    ...(global.db.data || {})
  };
};

loadDatabase();
if (global.db) setInterval(async () => {
   if (global.db.data) await global.db.write();
}, 30 * 1000);

require('./main.js');
nocache('../main.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'));
require('./main.js');
nocache('../main.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'));

//------------------------------------------------------
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState(`./session`);
  const msgRetryCounterCache = new NodeCache();

  const bot = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false, // Suppression du QR dans le terminal
    browser: Browsers.windows('Firefox'), 
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    markOnlineOnConnect: true,
    getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid);
      let msg = await store.loadMessage(jid, key.id);
      return msg?.message || "";
    },
    msgRetryCounterCache, 
  });

  store.bind(bot.ev);

  bot.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    try {
      if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        console.log(`Connection closed. Reason: ${reason}`);
        if (reason === DisconnectReason.loggedOut) {
          console.log('Logged out. Please delete session and scan again.');
        } else {
          startBot(); // Reconnect
        }
      } else if (connection === 'open') {
        console.log(color(`🌿Connected to => ${JSON.stringify(bot.user, null, 2)}`, 'yellow'));
      }
    } catch (err) {
      console.log('Error in connection update:', err);
      startBot(); // Attempt to reconnect
    }
  });

  bot.ev.on('creds.update', saveCreds);
  bot.ev.on("messages.upsert", () => { });

  // Ask for pairing code if needed
  if (!bot.authState.creds.registered) {
    const phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please enter your WhatsApp number (e.g., +1234567890): `)));
    const code = await bot.requestPairingCode(phoneNumber);
    console.log(`Your pairing code: ${code.match(/.{1,4}/g).join("-")}`);
  }
}

startBot();
