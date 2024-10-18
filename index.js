const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const qrcode = require('qrcode-terminal');
const ytdl = require('ytdl-core');

// Préfixe pour les commandes
const prefix = '.';

// Liste de blagues
const jokes = [
    "Pourquoi les plongeurs plongent-ils toujours en arrière et jamais en avant ? Parce que sinon ils tombent dans le bateau.",
    "Pourquoi les fantômes sont-ils de si mauvais menteurs ? Parce qu'on peut lire à travers eux.",
    "Quelle est la boisson préférée des informaticiens ? Le code-aux-cerises !",
    "Quel est le comble pour un électricien ? De ne pas être au courant.",
    "Pourquoi les squelettes ne se battent jamais entre eux ? Parce qu'ils n'ont pas de tripes.",
    "Comment appelle-t-on un chat qui a avalé un citron ? Un chat aigre !",
    "Pourquoi les maths sont-elles tristes ? Parce qu'elles ont trop de problèmes.",
    "Quel est le fruit le plus drôle ? La poire, parce qu'elle est trop drôle !",
    "Pourquoi les vampires ne peuvent-ils pas se battre ? Parce qu'ils ont peur des croix.",
    "Pourquoi est-ce que le livre de maths est triste ? Parce qu'il a trop de problèmes.",
    "Comment appelle-t-on un canard qui a réussi à l'école ? Un canard diplômé !",
    "Pourquoi les fantômes aiment-ils les fêtes ? Parce qu'ils sont toujours dans l'ambiance.",
    "Pourquoi les ordinateurs n'aiment-ils pas la nature ? Parce qu'il y a trop de bugs.",
    "Quel est le comble pour un jardinier ? De raconter des salades !",
    "Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tombent dans le bateau.",
    "Pourquoi les canards sont-ils toujours de bonne humeur ? Parce qu'ils ont toujours un coin de paradis !",
    "Quelle est la plante préférée des pirates ? La plante de la mer !",
    "Comment fait un escargot pour aller à l'école ? Il prend son temps !",
    "Pourquoi les éléphants n'utilisent-ils pas d'ordinateur ? Parce qu'ils ont peur des souris !",
    "Pourquoi les mouches n'ont-elles jamais de succès ? Parce qu'elles n'ont jamais de plan !",
    "Comment appelle-t-on un chat qui tombe dans un pot de peinture le jour d'Halloween ? Un chat coloré !",
    "Pourquoi les abeilles ont-elles les cheveux collants ? Parce qu'elles utilisent du miel-peigne !",
    "Quel est le comble pour un informaticien ? De perdre le fil de sa pensée !",
    "Pourquoi les fantômes sont-ils de si mauvais menteurs ? Parce qu'on peut lire à travers eux.",
    "Quel est le comble pour un voleur ? De se faire prendre en flagrant délit de vol d'identité !",
    "Pourquoi les poissons détestent l'ordinateur ? Parce qu'ils ont peur du net !",
    "Pourquoi les livres de cuisine n'ont-ils pas d'amis ? Parce qu'ils sont trop épicés !",
    "Quel est le comble pour un magicien ? De disparaître dans une dépression !",
    "Pourquoi les araignées sont-elles de si bonnes informaticiennes ? Parce qu'elles font des sites web !",
    "Quelle est la matière préférée des chats à l'école ? Le miaou-nth !",
    "Pourquoi les légumes ne parlent-ils pas ? Parce qu'ils ont peur d'être pris pour des radis !",
    "Quel est le comble pour un jardinier ? De ne pas avoir la main verte !",
    "Pourquoi les fantômes sont-ils de si mauvais menteurs ? Parce qu'on peut lire à travers eux.",
    "Pourquoi les éléphants ne prennent-ils jamais de photos ? Parce qu'ils ont peur des flashs !",
    "Quel est le comble pour un romancier ? De manquer d'inspiration !"
];

// Liste de citations
const quotes = [
    "La vie est un défi, relève-le !",
    "Fais ce que tu peux, avec ce que tu as, là où tu es.",
    "La seule limite à notre réalisation de demain sera nos doutes d'aujourd'hui.",
    "Ne rêve pas ta vie, vis tes rêves.",
    "L'avenir appartient à ceux qui croient à la beauté de leurs rêves.",
    "Il n'y a pas de vent favorable pour celui qui ne sait pas où il va.",
    "Le succès est la somme de petits efforts répétés jour après jour.",
    "La vie est comme une bicyclette, il faut avancer pour ne pas perdre l'équilibre.",
    "La simplicité est la sophistication suprême.",
    "Ce n'est pas la destination qui compte, mais le voyage.",
    "N'attends pas. Le temps ne sera jamais juste.",
    "Tout ce dont vous avez besoin est déjà en vous.",
    "La vie est 10% ce qui nous arrive et 90% comment nous y réagissons.",
    "Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment est maintenant.",
    "Vous ne trouvez pas le bonheur, vous le créez.",
    "Le plus grand risque est de ne prendre aucun risque. Dans un monde qui change très vite, la seule stratégie qui échoue est de ne pas prendre de risques.",
    "Les rêves ne fonctionnent que si vous travaillez dur.",
    "Votre temps est limité, ne le gaspillez pas à vivre la vie de quelqu'un d'autre.",
    "L'échec est simplement l'opportunité de recommencer, cette fois de manière plus intelligente.",
    "N'ayez pas peur d'abandonner le bon pour aller vers l'excellent.",
    "Le meilleur moyen de prédire l'avenir est de l'inventer.",
    "Chaque jour est une nouvelle chance de changer votre vie.",
    "Ne comptez pas les jours, faites en sorte que les jours comptent.",
    "La seule façon de faire un excellent travail est d’aimer ce que vous faites.",
    "La vie est un 10 % ce qui nous arrive et un 90 % comment nous y réagissons.",
    "Si vous pouvez le rêver, vous pouvez le faire.",
    "Le bonheur est un choix, pas une conséquence.",
    "Les grands esprits ont toujours rencontré une opposition violente des esprits médiocres.",
    "Ce qui ne nous tue pas nous rend plus fort.",
    "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès.",
    "Soyez vous-même ; tout le monde est déjà pris.",
    "N'attendez pas le moment parfait, prenez un moment et rendez-le parfait."
];

// Liste de faits
const facts = [
    "Les abeilles peuvent reconnaître les visages humains.",
    "Le plus grand désert du monde est l'Antarctique.",
    "Les kangourous ne peuvent pas marcher en arrière.",
    "Les pieuvres ont trois cœurs.",
    "La langue d'une girafe peut mesurer jusqu'à 45 centimètres.",
    "Les humains partagent 50 % de leur ADN avec les bananes.",
    "Un groupe de flamants roses s'appelle une 'flamboyance'.",
    "Les termites peuvent manger du bois à une vitesse de 3 cm par minute.",
    "Les poulpes ont trois cœurs et le sang bleu.",
    "Le cœur d'une crevette est situé dans sa tête.",
    "Une tortue peut respirer par son derrière.",
    "Les grenouilles peuvent geler sans mourir.",
    "Les vaches ont des amis et se stressent quand ils sont séparés.",
    "Un seul nuage peut peser plus d'un million de livres.",
    "Le mot 'nerd' a été inventé par Dr. Seuss dans 'If I Ran the Zoo'.",
    "Les étoiles de mer n'ont pas de cerveau mais peuvent régénérer leurs bras.",
    "Le plus grand organisme vivant est un champignon en Oregon qui couvre plus de 3 000 acres.",
    "Les moustiques sont attirés par les personnes qui mangent des bananes.",
    "Le miel ne se périme jamais. Des pots de miel vieux de 3000 ans ont été retrouvés en Égypte.",
    "Les fourmis peuvent soulever jusqu'à 50 fois leur poids.",
    "Le nez humain peut détecter plus d'un billion d'odeurs différentes.",
    "Les dauphins ont des noms pour s'appeler entre eux.",
    "L'escargot peut dormir jusqu'à trois ans, dépendant des conditions.",
    "Les chats ont plus de 20 muscles pour contrôler leurs oreilles.",
    "Le son d'un cri de poulet peut être entendu à un mile de distance.",
    "Un seul gramme de terre peut contenir des milliards de bactéries.",
    "Les requins existent depuis plus de 400 millions d'années, même avant les arbres.",
    "Les fourmis ne dorment jamais. Elles ferment juste les yeux.",
    "Un paresseux peut prendre jusqu'à un mois pour digérer un repas.",
    "Les flamants roses deviennent roses à cause de leur alimentation, riche en caroténoïdes.",
    "Les colibris sont les seuls oiseaux capables de voler à reculons.",
    "Le cœur d'une baleine bleue peut peser autant qu'une petite voiture.",
    "La majorité des étoiles que l'on voit dans le ciel sont en fait des millions d'années-lumière loin.",
    "La première lettre de l'alphabet grec, alpha, est à l'origine du mot 'alphabétisation'.",
    "Il y a plus d'arbres sur Terre que d'étoiles dans notre galaxie.",
    "Les flamants dorment debout pour protéger leurs pattes des prédateurs.",
    "La Terre est la seule planète connue à avoir de l'eau liquide à sa surface.",
    "Les pieuvres peuvent changer de couleur pour se camoufler dans leur environnement."
];

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

        case 'menu':
            const menu = `
*HANS MD* - Menu des commandes :
1. .joke - Retourne une blague
2. .quote - Retourne une citation inspirante
3. .fact - Retourne un fait intéressant
4. .8ball [question] - Réponse de Magic 8-ball
5. .flip - Lancer une pièce
6. .roll - Lancer un dé
7. .math [expression] - Calculatrice simple
8. .video [lien] - Télécharger une vidéo YouTube
9. .song [lien] - Télécharger une chanson YouTube
`;
            await client.sendMessage(msg.key.remoteJid, { text: menu });
            break;

        default:
            await client.sendMessage(msg.key.remoteJid, { text: 'Commande inconnue. Utilisez .menu pour voir les commandes disponibles.' });
    }
}

// Connexion à WhatsApp
async function connectToWhatsApp() {
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

    client.ev.on('messages.upsert', async (msg) => {
        const message = msg.messages[0];
        if (!message.message) return;

        const textMessage = message.message.conversation || message.message.extendedTextMessage?.text;

        if (textMessage && textMessage.startsWith(prefix)) {
            const commandBody = textMessage.slice(prefix.length).trim();
            const commandName = commandBody.split(' ')[0];
            const args = commandBody.split(' ').slice(1);
            await handleCommand(client, msg, commandName, args);
        }
    });
}

// Démarrer le bot
connectToWhatsApp();
