const Discord = require("discord.js"),
  db = require("quick.db");

exports.run = async (bot, message, args, tools) => {

if(db.fetch(`bakimmod`)) {

  if(message.author.id !== "683752128644251660") return message.channel.send('```Şuanlık Discord Botumuz Bakımdadır Lütfen Bir Kaç Saat Sonra Tekrar Deneyiniz Veya Ellunati#4909 Bana Ulaşın```')

}


  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "el!";
  const embed = new Discord.MessageEmbed()
  
  .setAuthor(`Komutlar`, message.author.avatarURL)
    .setDescription(`Prefix: **${prefix}**`)

.setImage("https://cdn.discordapp.com/attachments/788673281455685653/810117778613731328/standard.gif") 

  .addField("Elrex Mute Sistemi (3)", `
Sadece premium üyelerimizin kullanabileceği komutlar;
\`${prefix}mute-rol\` \`${prefix}mute\` \`${prefix}mute-rol oluştur\`
`)

 .addField("Bağlantılar", `
[Davet Et](https://discord.com/oauth2/authorize?client_id=802833358065369098&scope=bot&permissions=268443710) -- [Destek Sunucumuz](https://discord.gg/QjSEtxVU5m) -- [Sitemiz](https://elrexsupport.glitch.me/) -- [OyVer](https://bots.discordshare.ml/bot/802833358065369098) 
`)
 

    .setColor("RANDOM")
    .setFooter(`Elrex © | Tüm hakları saklıdır.`)
  .setTimestamp()     
  message.channel.send(embed);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["mute-bilgi","mte-y","mute-help","mute-yardım"],
  permLevel: 0
};

exports.help = {
  name: "mute-sistem"
};
