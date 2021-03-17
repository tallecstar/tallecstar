const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

const db = require('quick.db')

exports.run = (client, message, params) => {

if(db.fetch(`bakimmod`)) {

  if(message.author.id !== "683752128644251660") return message.channel.send('```Şuanlık Discord Botumuz Bakımdadır Lütfen Bir Kaç Saat Sonra Tekrar Deneyiniz Veya Ellunati#4909 Bana Ulaşın```')

}

message.react("✅");
let p = db.fetch(`prefix_${message.guild.id}`)
let prefix = ayarlar.prefix;
if (p) prefix = p;
let muterol
    muterol = message.guild.roles.create({
    data:{
    name: "Muted",
    color: "WHITE"
    }
   }).then(muterol => {
 
 message.guild.channels.cache.forEach(channel => {
   
   channel.updateOverwrite(muterol, {
     SEND_MESSAGES: false,
     ADD_REACTIONS: false
    })})})
    message.channel.send(`Mute rolü başarıyla ${muterol} olarak oluşturuldu, ayarlamak için ${prefix}muterol.`)
  }
    
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 2
}

exports.help = {
    name: 'muterololuştur',
    description: '',
    usage: 'neivainsta'
}