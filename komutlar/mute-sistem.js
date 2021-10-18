const Discord = require("discord.js"),
  db = require("quick.db");

exports.run = async (bot, message, args, tools) => {

if(db.fetch(`bakimmod`)) {

  if(message.author.id !== "591157478578978816") return message.channel.send('```Şuanlık Discord Botumuz Bakımdadır Lütfen Bir Kaç Saat Sonra Tekrar Deneyiniz```')

}


  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!";
  const embed = new Discord.MessageEmbed()
  
  .setAuthor(`Komutlar`, message.author.avatarURL)
    .setDescription(`Prefix: **${prefix}**`)

.setImage("") 

  .addField("Mute Sistemi (3)", `
Sadece premium üyelerimizin kullanabileceği komutlar;
\`${prefix}mute-rol\` \`${prefix}mute\` \`${prefix}mute-rol oluştur\`
`)

 .addField("Bağlantılar", `
[Davet Et]) 
`)
 

    .setColor("RANDOM")
    .setFooter(` © | Tüm hakları saklıdır.`)
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
