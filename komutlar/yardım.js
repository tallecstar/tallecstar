const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => { 

if(db.fetch(`bakimmod`)) {

  if(message.author.id !== "683752128644251660") return message.channel.send('```Şuanlık Discord Botumuz Bakımdadır Lütfen Bir Kaç Saat Sonra Tekrar Deneyiniz Veya Ellunati#4909 Bana Ulaşın```')

}

let prefix = 'el!'
let yardım = new Discord.MessageEmbed()  
.setColor('RANDOM')
.addField('Murat Eren Yardım Menüsü',`
🔔 **${prefix}Ban** : Etiketlenen kişiyi yasaklarsın
🔔 **${prefix}boş** : BOŞ`)
  .addField("**» Davet Linki**", " [Botu Davet Et](https://discord.com/api/oauth2/authorize?client_id=787328444954050570&permissions=8&scope=bot)", )
    .setImage("https://cdn.discordapp.com/attachments/788673281455685653/810117778613731328/standard.gif")
.setFooter(`${message.author.tag} Tarafından İstendi.`, message.author.avatarURL())
.setThumbnail(client.user.avatarURL())
 message.channel.send(yardım) 
  };

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['help'],
  permLevel: 0
};

exports.help = {
  name: "yardım",
  category: "Yardım menüsü Kısa ve öz",
    description: "yardımcık"
};