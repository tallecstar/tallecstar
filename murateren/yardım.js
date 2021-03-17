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

  .addField("Tüm Komutlar (10)", `
Sadece premium üyelerimizin kullanabileceği komutlar;
\`${prefix}prefix\` \`${prefix}sunucu-tanıt\`  \`${prefix}duello\` \`${prefix}çekiliş-düzenle\` \`${prefix}seviye-xp\`
`)

 .addField("Bağlantılar", `
[Davet Et](https://discord.com/oauth2/authorize?client_id=802833358065369098&scope=bot&permissions=268443710) -- [Destek Sunucumuz](https://discord.gg/QjSEtxVU5m) -- [Sitemiz](https://elrexsupport.glitch.me/) -- [OyVer](https://top.gg/bot/802833358065369098) 
`)
 

    .setColor("RANDOM")
    .setFooter(`MuratEren-Ellunati © | Tüm hakları saklıdır.`)
  .setTimestamp()     
  message.channel.send(embed);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["help","bilgi","y","h"],
  permLevel: 0
};

exports.help = {
  name: "yardım"
};