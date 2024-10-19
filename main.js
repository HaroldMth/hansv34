const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('whiskeysockets/baileys');
const ytdl = require('ytdl-core');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Clés d'API
const OPENAI_API_KEY = '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';
const SUNO_API_KEY = '635ab40d60fe4b1da74e374de0b3ac6e';

// Charger les blagues, citations et faits depuis un fichier
const jokes = JSON.parse(fs.readFileSync(path.join(__dirname, 'jokes.json'), 'utf-8'));
const quotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'quotes.json'), 'utf-8'));
const facts = JSON.parse(fs.readFileSync(path.join(__dirname, 'facts.json'), 'utf-8'));

// Fonction pour chaque commande
async function handleCommand(client, msg, commandName, args) {
    switch (commandName) {
        case 'joke':
            const joke = jokes[Math.floor(Math.random() * jokes.length)];
            await client.sendMessage(msg.key.remoteJid, { text: joke });
            break;
        case 'quote':
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            await client.sendMessage(msg.key.remoteJid, { text: quote });
            break;
        case 'fact':
            const fact = facts[Math.floor(Math.random() * facts.length)];
            await client.sendMessage(msg.key.remoteJid, { text: fact });
            break;
        case '8ball':
            const responses = ["Oui", "Non", "Peut-être", "Je ne sais pas", "Absolument"];
            const response = responses[Math.floor(Math.random() * responses.length)];
            await client.sendMessage(msg.key.remoteJid, { text: response });
            break;
        case 'flip':
            const result = Math.random() < 0.5 ? 'Pile' : 'Face';
            await client.sendMessage(msg.key.remoteJid, { text: result });
            break;
        case 'roll':
            const diceResult = Math.floor(Math.random() * 6) + 1;
            await client.sendMessage(msg.key.remoteJid, { text: `Vous avez obtenu : ${diceResult}` });
            break;
        case 'math':
            const expression = args.join(' ');
            try {
                const mathResult = eval(expression);
                await client.sendMessage(msg.key.remoteJid, { text: `Le résultat de ${expression} est : ${mathResult}` });
            } catch (error) {
                await client.sendMessage(msg.key.remoteJid, { text: 'Erreur dans l\'expression mathématique.' });
            }
            break;
        case 'video':
            const videoUrl = args[0];
            if (!ytdl.validateURL(videoUrl)) {
                await client.sendMessage(msg.key.remoteJid, { text: 'URL invalide. Veuillez fournir une URL YouTube.' });
                return;
            }

            await client.sendMessage(msg.key.remoteJid, { text: 'Téléchargement de la vidéo...' });

            try {
                const stream = ytdl(videoUrl, { quality: 'highestvideo' });
                const buffer = [];

                stream.on('data', chunk => buffer.push(chunk));
                stream.on('end', async () => {
                    const videoBuffer = Buffer.concat(buffer);
                    await client.sendMessage(msg.key.remoteJid, { video: videoBuffer, caption: 'Voici votre vidéo!' });
                });
            } catch (error) {
                await client.sendMessage(msg.key.remoteJid, { text: 'Erreur lors du téléchargement de la vidéo.' });
            }
            break;
        case 'song':
            const songUrl = args[0];
            if (!ytdl.validateURL(songUrl)) {
                await client.sendMessage(msg.key.remoteJid, { text: 'URL invalide. Veuillez fournir une URL YouTube.' });
                return;
            }

            await client.sendMessage(msg.key.remoteJid, { text: 'Téléchargement de la chanson...' });

            try {
                const stream = ytdl(songUrl, { filter: 'audioonly' });
                const buffer = [];

                stream.on('data', chunk => buffer.push(chunk));
                stream.on('end', async () => {
                    const songBuffer = Buffer.concat(buffer);
                    await client.sendMessage(msg.key.remoteJid, { audio: songBuffer, caption: 'Voici votre chanson!' });
                });
            } catch (error) {
                await client.sendMessage(msg.key.remoteJid, { text: 'Erreur lors du téléchargement de la chanson.' });
            }
            break;
        case 'dalle':
            const dallePrompt = args.join(' ');
            try {
                const response = await axios.post(
                    'https://api.openai.com/v1/images/generations',
                    {
                        prompt: dallePrompt,
                        n: 1,
                        size: "1024x1024"
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${OPENAI_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const imageUrl = response.data.data[0].url;
                await client.sendMessage(msg.key.remoteJid, { text: `Voici l'image générée : ${imageUrl}` });
            } catch (error) {
                await client.sendMessage(msg.key.remoteJid, { text: 'Erreur lors de la génération de l\'image DALL-E.' });
            }
            break;
        case 'chatgpt':
            const chatGptPrompt = args.join(' ');
            try {
                const response = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: chatGptPrompt }],
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${OPENAI_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const chatGptResponse = response.data.choices[0].message.content;
                await client.sendMessage(msg.key.remoteJid, { text: chatGptResponse });
            } catch (error) {
                await client.sendMessage(msg.key.remoteJid, { text: 'Erreur lors de la génération de la réponse ChatGPT.' });
            }
            break;
        case 'suno':
            const sunoPrompt = args.join(' ');
            try {
                const response = await axios.post(
                    'https://api.suno.ai/v1/generate',
                    {
                        text: sunoPrompt,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${SUNO_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const audioUrl = response.data.audio_url; // Vérifiez la structure de la réponse de Suno
                await client.sendMessage(msg.key.remoteJid, { audio: { url: audioUrl }, caption: 'Voici le son généré!' });
            } catch (error) {
                await client.sendMessage(msg.key.remoteJid, { text: 'Erreur lors de la génération du son avec Suno.' });
            }
            break;
        case 'menu':
            const menu = `*HANS MD* - Menu des commandes :
1. .joke - Retourne une blague
2. .quote - Retourne une citation inspirante
3. .fact - Retourne un fait intéressant
4. .8ball [question] - Réponse de Magic 8-ball
5. .flip - Lancer une pièce
6. .roll - Lancer un dé
7. .math [expression] - Calculer une expression mathématique
8. .video [URL] - Télécharger une vidéo YouTube
9. .song [URL] - Télécharger une chanson YouTube
10. .dalle [prompt] - Générer une image avec DALL-E
11. .chatgpt [prompt] - Demander à ChatGPT
12. .suno [prompt] - Générer un son avec Suno
13. .menu - Voir ce menu`;

            await client.sendMessage(msg.key.remoteJid, { text: menu });
            break;
        default:
            await client.sendMessage(msg.key.remoteJid, { text: 'Commande inconnue. Tapez .menu pour voir la liste des commandes.' });
    }
}

module.exports = { handleCommand };
