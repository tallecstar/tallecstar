const Discord = require("discord.js");
const Database = require("../Helpers/Database");
const vt = new Database("Database", "Voice");
const mdb = new Database("Database", "Message");
const moment = require("moment");
require("moment-duration-format");
// exports.onLoad = (client) => {};
/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 */
exports.run = async (client, message, args) => {
    const voiceData = vt.get(`stats.${message.guild.id}`) || undefined;
    const messageData = mdb.get(`stats.${message.guild.id}`) || undefined;

    let messageList = "Bilgi Bulunamadı.";
    if(messageData){
        messageList = Object.keys(messageData || {}).map(md => {
            return {
                Id: md,
                Total: Object.values(messageData[md].channels || {}).reduce((a, b) => a + b, 0)
            };
        }).sort((a, b) => b.Total - a.Total).splice(0, 10).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message\``).join("\n║");    
    }

    let voiceList = "Bilgi Bulunamadı.";
    if(voiceData){
        voiceList = Object.keys(voiceData || {}).map(md => {
            return {
                Id: md,
                Total: Object.values(voiceData[md].channels || {}).reduce((a, b) => a + b, 0)
            };
        }).sort((a, b) => b.Total - a.Total).splice(0, 10).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hours,] m [minutes] s [seconds]")}\``).join("\n║");
    }

    let embed = new Discord.MessageEmbed();
  embed.setColor('RANDOM')
    .setFooter('Rozy')
    .setThumbnail(message.author.avatarURL({dynamic: true}))
    .setDescription(`Aşağıda Ses Ve Mesaj Aktiflik Sıralamasını Görebilirsiniz.`)
    .addField("Ses Sıralaması;", `
    \`\`\`En Çok Seste Duran Kişilerin Sıralaması;\`\`\`
    ╔═══════════◥◣❖◢◤════════════╗
    ║
    ║**${voiceList}**
    ║
    ╚═══════════◥◣❖◢◤════════════╝
    `)
    .addField("Sohbet Sıralaması;", `
   \`\`\`En Çok Mesaj Atan Kişilerin Sıralaması;\`\`\`
    ╔═══════════◥◣❖◢◤════════════╗
    ║
    ║**${messageList}**
    ║
    ╚═══════════◥◣❖◢◤════════════╝
    `);    message.channel.send(embed);
};

exports.conf = {
    aliases: ["top", "siralama", "sıralama", "ranks", "ranking"],
    enabled: true,
    guildOnly: true
};

exports.help = { 
    name: 'eniyi', 
    description: 'Resets server statics.',
    usage: '[p]rstats [all/voice/messages]',
    category: 'Guild'
};
