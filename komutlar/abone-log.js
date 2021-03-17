let db = require("quick.db")
let ayarlar = require("../ayarlar.json")

exports.run = async(client, message) => {

if(db.fetch(`bakimmod`)) {

  if(message.author.id !== "683752128644251660") return message.channel.send('```Şuanlık Discord Botumuz Bakımdadır Lütfen Bir Kaç Saat Sonra Tekrar Deneyiniz Veya Ellunati#4909 Bana Ulaşın```')

}

  if(!message.member.hasPermission(`ADMINISTRATOR`)) return message.channel.send(`❌ Bu komutu kullanabilmek için gerekli yetkiye sahip değilsin.`)
  
  let log = message.mentions.channels.first()
  if(!log) return message.channel.send(`❌ **Bir kanal etiketlemen gerekmekte örnek: __${ayarlar.prefix}abonelog #kanal__**`)
  
  
  db.set(`abonelog.${message.guild.id}`, log.id)
  message.channel.send(`✅ **Abone kanalı başarıyla "${log}" olarak ayarlandı.**`)
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['abone-log'],
  perm: 0
}
exports.help = {
  name: 'abonelog'
}

exports.play = {
  kullanım: 'y!abonelog #kanal',
  açıklama: 'Abone Logunu Ayarlarsınız',
  kategori: 'Abone'
}