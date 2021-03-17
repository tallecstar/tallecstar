const Discord = require("discord.js"),
  db = require("quick.db");

exports.run = async (bot, message, args, tools) => {


  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "m!";
  const embed = new Discord.MessageEmbed()
  
  .setAuthor(`Komutlar`, message.author.avatarURL)
    .setDescription(`Prefix: **${prefix}**`)

.setImage("https://cdn.discordapp.com/attachments/788673281455685653/810117778613731328/standard.gif") 

  .addField("Tüm Komutlar (10)", `
Sadece premium üyelerimizin kullanabileceği komutlar;
\`${prefix}ban\`
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