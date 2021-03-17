const fs = require("fs");
const Discord = require("discord.js");
const { Client, Util } = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");
const chalk = require("chalk");
const fetch = require("node-fetch");
const moment = require("moment");
const ayarlar = require("./ayarlar.json");
const express = require("express");

/////
const app = express();
app.get("/", (req, res) =>
  res.send("Bot Aktif | Discord = Ellunati Yapım")
);
app.listen(process.env.PORT, () =>
  console.log("Port ayarlandı: " + process.env.PORT)
);
//////////////////////////////////////////////////////////////

//------------------Değişen Oynuyor---------------------------\\

const bot = new Discord.Client();

var oyun = [
`✨ HELP ?! | m!yardım`,
`🚀 7/24 HIZMET  `,
`🔔 20K Kullanıcı`,
`⚡️ 25 Sunucu`,
`🌟 Prefix | (m!)`
]
  
client.on("ready", () => {
setInterval(function() {

         var random = Math.floor(Math.random()*(oyun.length-0+1)+0);
         client.user.setActivity(oyun[random], {"type": "WATCHING"});

        }, 2 * 5000);
});



//-------------Bot Eklenince Bir Kanala Mesaj Gönderme Komutu ---------------\\

const embed = new Discord.MessageEmbed()
.setThumbnail()
.addField(`MRTERN | MRT`, `**Selamlar, Ben Ellunati (Bu Bot'un Geliştiricisi) Öncelikle Botumuzu Eklediğiniz ve Bize Destek Olduğunuz İçin Sizlere Teşekkürlerimi Sunarım**`)
.addField(`MRTERN | Yardım Menüsü`, `**m!yardım yazarak tüm komutlarımıza bakabilirsin**`)
.setFooter(`MRTERN | Mutlu Bir Nefes| 2021`)
.setTimestamp();


const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./murateren/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yüklemeye hazırlanılıyor.`);
  files.forEach(f => {
    let props = require(`./murateren/${f}`);
    log(`Yüklenen komut ismi: ${props.help.name.toUpperCase()}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.yetkiler = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = -ayarlar.varsayilanperm;
  if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if (message.member.hasPermission("KICK_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
  if (message.member.hasPermission("MANAGE_GUILD")) permlvl = 4;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 5;
  if (message.author.id === message.guild.ownerID) permlvl = 6;
  if (message.author.id === ayarlar.sahip) permlvl = 7;
  return permlvl;
};

client.login(process.env.token);
