const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => { 

if(db.fetch(`bakimmod`)) {

  if(message.author.id !== "683752128644251660") return message.channel.send('```Şuanlık Discord Botumuz Bakımdadır Lütfen Bir Kaç Saat Sonra Tekrar Deneyiniz Veya Ellunati#4909 Bana Ulaşın```')

}

  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "m!";
  const embed = new Discord.MessageEmbed()

let yardım = new Discord.MessageEmbed()  
.setColor('RANDOM')
.addField('Murat-Eren Yardım Menüsü',`
==============================================
🔔 **${prefix}abone-yetkili-rol** : Abone Yetkilisini Seçer.
🔔 **${prefix}abone-rol** : Vericeğiniz Rolü ayarlarsınız.
🔔 **${prefix}abone-log** : Log mesajınn gitceği yer seçilir.
==================MODERASYON==================
🔔 **${prefix}ban** : Etiketlediğiniz Kullancıyı Sunucudan Yasaklar
🔔 **${prefix}prefix** : Prefix Değiştirir
🔔 **${prefix}bakım** : Botu Bakıma Alırsınız (Sadece bot sahibi kullanabilir)
🔔 **${prefix}sil** : Mesaj silersiniz (max 300)
🔔 **${prefix}temizle** : Mesaj silersiniz (max 300)
🔔 **${prefix}sohbet-aç** : Sohbeti açarsınız
🔔 **${prefix}sohbet-kapat** : Sohbeti kapatırsınız
🔔 **${prefix}patlat** : Kanalı havaya uçurursunuz
===============================================
`)
  .addField("**» Davet Linki**", " [Botu Davet Et](https://discord.com/api/oauth2/authorize?client_id=787328444954050570&permissions=8&scope=bot)", )
    .setImage("https://cdn.discordapp.com/attachments/821825276232728576/821831310213382264/standard.gif")
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
  category: "abone-yardım",
    description: "Eğlence Komutları Gösterir."
};