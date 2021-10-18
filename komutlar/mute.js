const Discord = require("discord.js");
const ms = require("ms");
const ayarlar = require("../ayarlar.json");
const db = require('quick.db')





module.exports.run = async (bot, message, args) => {

if(db.fetch(`bakimmod`)) {

  if(message.author.id !== "591157478578978816") return message.channel.send('```Şuanlık Discord Botumuz Bakımdadır Lütfen Bir Kaç Saat Sonra Tekrar Deneyiniz Veya Ellunati#4909 Bana Ulaşın```')

}

  let p = db.fetch(`prefix_${message.guild.id}`)
let prefix = ayarlar.prefix;
if (p) prefix = p;

   
  let mutekisi = message.guild.member(
    message.mentions.users.first() || message.guild.members.cache.get(args[0])
  );
       const hata = new Discord.MessageEmbed()
    .setColor("RED")
    .setTimestamp()
    .addField('HATA:', `:warning: Lütfen bir kullanıcı etiketleyiniz! \nDoğru Kullanım; **el!mute <@kullanıcı> <1sn/1dk/1sa/1g>**`)
  if (!mutekisi)
    return message.reply(hata);
           const hataa = new Discord.MessageEmbed()
    .setColor("RED")
    .setTimestamp()
    .addField('HATA:', `:warning: Yetkili bir kişiyi muteleyemem! \nDoğru Kullanım; \`el!mute <@kullanıcı> <1sn/1dk/1sa/1g>\``)
  if (mutekisi.hasPermission("MANAGE_ROLES"))
    return message.reply(hataa);
  let sebep = args.splice(2, args.length).join(" ");
  if(!sebep) sebep = 'Sebep Belirtilmemiş';
  let muterol = db.fetch(`muterol_${message.guild.id}`);
if(!muterol) {
  message.channel.send(`Lütfen bir muteli rol ayarlayın. Ayarlamak için !muterol, yeni oluşturmak için ${prefix}muterololuştur`)
}
  let mutezaman = args[1]
    .replace(`sn`, `s`)
    .replace(`dk`, `m`)
    .replace(`sa`, `h`)
    .replace(`g`, `d`);
     const hat = new Discord.MessageEmbed()
    .setColor("RED")
    .setTimestamp()
    .addField('HATA:', `:warning: Lütfen bir zaman giriniz! \nDoğru Kullanım; \`el!mute <@kullanıcı> <1sn/1dk/1sa/1g>\``)
  if (!mutezaman) return message.reply(hat);

mutekisi.roles.add(muterol);
 db.set(`muteli_${mutekisi.guild.id + mutekisi.id}`, 'muteli')
    const embed = new Discord.MessageEmbed()
    .setThumbnail(message.author.avatarURL())
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Eylem: **Mute**', `${mutekisi} (${mutekisi.id}) adlı kullanıcı **${sebep}** sebebiyle **${args[1]}** süre susturuldu`)
      message.channel.send(embed);

  setTimeout(function() {
    mutekisi.roles.remove(muterol);
    db.delete(`muteli_${mutekisi.guild.id + mutekisi.id}`)
  }, ms(mutezaman));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["tempmute"],
  permLevel: 2
};

exports.help = {
  name: "mute",
  description: "Etiketlediğiniz kişiye belirttiğiniz süre kadar mute atar.",
  usage: "mute <@kullanıcı> <1sn/1dk/1sa/1g>"
};