const { connectToWhatsApp } = require('./main');
const { prefix } = require('./settings');

// Démarrer le bot
connectToWhatsApp(prefix);
