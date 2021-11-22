const fs = require("fs");
const Discord = require("discord.js");
const { Client, Util } = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");
const chalk = require("chalk");
const fetch = require("node-fetch");
const moment = require("moment");
const { GiveawaysManager } = require("discord-giveaways");
const ayarlar = require("./ayarlar.json");
const express = require("express");
const vt = require("quick.db");

console.log("--------------------------------");
console.log("Events Yükleniyor...");
fs.readdirSync("./events", { encoding: "utf-8" }).filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./events/${file}`);
    client.on(prop.conf.event, prop.execute);
    console.log(`[EVENT] ${file} Başarıyla Yüklendi !`);
});

/////
/*const app = express();
app.get("/", (req, res) =>
  res.send("Bot Aktif | Discord = https://discord.gg/NMnPUjK")
);
app.listen(process.env.PORT, () =>
  console.log("Port ayarlandı: " + process.env.PORT)
);
//////////////////////////////////////////////////////////////
*/

//------------------Değişen Oynuyor---------------------------\\

const bot = new Discord.Client();

var oyun = [`✨`, `🚀  `, `🌟 Prefix | (!)`];

client.on("ready", () => {
  setInterval(function() {
    var random = Math.floor(Math.random() * (oyun.length - 0 + 1) + 0);
    client.user.setActivity(oyun[random], { type: "WATCHING" });
  }, 2 * 5000);
});

client.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(ayarlar.prefix)) return;
  let command = message.content.split(" ")[0].slice(ayarlar.prefix.length);
  let params = message.content.split(" ").slice(1);
  let perms = client.yetkiler(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
});

//-------------Bot Eklenince Bir Kanala Mesaj Gönderme Komutu ---------------\\

const embed = new Discord.MessageEmbed()
  .setThumbnail()
  .addField(
    `MRTERN | ELS`,
    `**Selamlar, Ben Yiğit (Saganın Bot Departman Geliştiricisi) Öncelikle Alt Yapımızı Tercih Ettiğiniz İçin Teşşekür Ederim**`
  )
  .addField(
    `MRTERN | BILGI`,
    `**ALT YAPI 20 tane komut bulunmaktadır gerisine bakın kendiniz :wink: **`
  )
  .addField(
    `Güncelleme Detayları`,
    `MehmetS tarafından Filtre sistemleri düzeltilmiştir.`
  )
  .setFooter(`MRTERN | Mutlu Bir Nefes| 2021`)
  .setTimestamp();

client.on("guildCreate", guild => {
  let defaultChannel = "";
  guild.channels.cache.forEach(channel => {
    if (channel.type == "text" && defaultChannel == "") {
      if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
      }
    }
  });

  defaultChannel.send(embed);
});

//----------------------------------------------------------------\\

client.on("message", async message => {
  if (message.author.bot) return;

  if (!message.guild) return;

  let prefix = db.get(`prefix_${message.guild.id}`);

  if (prefix === null) prefix = prefix;

  if (!message.content.startsWith(prefix)) return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content

    .slice(prefix.length)

    .trim()

    .split(/ +/g);

  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);

  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args);
});

//////////////////////////MODLOG///////////////////
client.on("messageDelete", async message => {
  if (message.author.bot || message.channel.type == "dm") return;

  let log = message.guild.channels.cache.get(
    await db.fetch(`log_${message.guild.id}`)
  );

  if (!log) return;

  const embed = new Discord.MessageEmbed()

    .setTitle(message.author.username + " | Mesaj Silindi")

    .addField("Kullanıcı: ", message.author)

    .addField("Kanal: ", message.channel)

    .addField("Mesaj: ", "" + message.content + "");

  log.send(embed);
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  let modlog = await db.fetch(`log_${oldMessage.guild.id}`);

  if (!modlog) return;

  let embed = new Discord.MessageEmbed()

    .setAuthor(oldMessage.author.username, oldMessage.author.avatarURL())

    .addField("**Eylem**", "Mesaj Düzenleme")

    .addField(
      "**Mesajın sahibi**",
      `<@${oldMessage.author.id}> === **${oldMessage.author.id}**`
    )

    .addField("**Eski Mesajı**", `${oldMessage.content}`)

    .addField("**Yeni Mesajı**", `${newMessage.content}`)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(
      `Sunucu: ${oldMessage.guild.name} - ${oldMessage.guild.id}`,
      oldMessage.guild.iconURL()
    )

    .setThumbnail(oldMessage.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("channelCreate", async channel => {
  let modlog = await db.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_CREATE" })
    .then(audit => audit.entries.first());

  let kanal;

  if (channel.type === "text") kanal = `<#${channel.id}>`;

  if (channel.type === "voice") kanal = `\`${channel.name}\``;

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Kanal Oluşturma")

    .addField("**Kanalı Oluşturan Kişi**", `<@${entry.executor.id}>`)

    .addField("**Oluşturduğu Kanal**", `${kanal}`)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(
      `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
      channel.guild.iconURL()
    )

    .setThumbnail(channel.guild.iconUR);

  client.channels.cache.get(modlog).send(embed);
});

client.on("channelDelete", async channel => {
  let modlog = await db.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Kanal Silme")

    .addField("**Kanalı Silen Kişi**", `<@${entry.executor.id}>`)

    .addField("**Silinen Kanal**", `\`${channel.name}\``)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(
      `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
      channel.guild.iconURL()
    )

    .setThumbnail(channel.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("roleCreate", async role => {
  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Rol Oluşturma")

    .addField("**Rolü oluşturan kişi**", `<@${entry.executor.id}>`)

    .addField("**Oluşturulan rol**", `\`${role.name}\` **=** \`${role.id}\``)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${role.guild.name} - ${role.guild.id}`,
      role.guild.iconURL
    )

    .setColor("RANDOM")

    .setThumbnail(role.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("roleDelete", async role => {
  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Rol Silme")

    .addField("**Rolü silen kişi**", `<@${entry.executor.id}>`)

    .addField("**Silinen rol**", `\`${role.name}\` **=** \`${role.id}\``)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${role.guild.name} - ${role.guild.id}`,
      role.guild.iconURL
    )

    .setColor("RANDOM")

    .setThumbnail(role.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiCreate", async emoji => {
  let modlog = await db.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Emoji Oluşturma")

    .addField("**Emojiyi oluşturan kişi**", `<@${entry.executor.id}>`)

    .addField("**Oluşturulan emoji**", `${emoji} - İsmi: \`${emoji.name}\``)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(
      `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
      emoji.guild.iconURL
    )

    .setThumbnail(emoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiDelete", async emoji => {
  let modlog = await db.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Emoji Silme")

    .addField("**Emojiyi silen kişi**", `<@${entry.executor.id}>`)

    .addField("**Silinen emoji**", `${emoji}`)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
      emoji.guild.iconURL
    )

    .setColor("RANDOM")

    .setThumbnail(emoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
  let modlog = await db.fetch(`log_${oldEmoji.guild.id}`);

  if (!modlog) return;

  const entry = await oldEmoji.guild
    .fetchAuditLogs({ type: "EMOJI_UPDATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Emoji Güncelleme")

    .addField("**Emojiyi güncelleyen kişi**", `<@${entry.executor.id}>`)

    .addField(
      "**Güncellenmeden önceki emoji**",
      `${oldEmoji} - İsmi: \`${oldEmoji.name}\``
    )

    .addField(
      "**Güncellendikten sonraki emoji**",
      `${newEmoji} - İsmi: \`${newEmoji.name}\``
    )

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(
      `Sunucu: ${oldEmoji.guild.name} - ${oldEmoji.guild.id}`,
      oldEmoji.guild.iconURL
    )

    .setThumbnail(oldEmoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("guildBanAdd", async (guild, user) => {
  let modlog = await db.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Yasaklama")

    .addField("**Kullanıcıyı yasaklayan yetkili**", `<@${entry.executor.id}>`)

    .addField("**Yasaklanan kullanıcı**", `**${user.tag}** - ${user.id}`)

    .addField("**Yasaklanma sebebi**", `${entry.reason}`)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

    .setThumbnail(guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("guildBanRemove", async (guild, user) => {
  let modlog = await db.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem**", "Yasak kaldırma")

    .addField("**Yasağı kaldıran yetkili**", `<@${entry.executor.id}>`)

    .addField("**Yasağı kaldırılan kullanıcı**", `**${user.tag}** - ${user.id}`)

    .setTimestamp()

    .setColor("RANDOM")

    .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

    .setThumbnail(guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

//////////////////////////////MODLOG///////////////////////////

//Muteliyken sw den çıkana mute
client.on("guildMemberAdd", async member => {
  let mute = db.fetch(`muterol_${member.guild.id}`);
  let mutelimi = db.fetch(`muteli_${member.guild.id + member.id}`);
  if (!mutelimi) return;
  if (mutelimi == "muteli") {
    member.roles.add(mute);
    member.send("Muteliyken Sunucudan Çıktığın için Yeniden Mutelendin!");
    const modlog = db.fetch(`modlogKK_${member.guild.id}`);
    if (!modlog) return;
    db.delete(`muteli_${member.guild.id + member.id}`);
    const embed = new Discord.MessageEmbed()
      .setThumbnail(member.avatarURL())
      .setColor(0x00ae86)
      .setTimestamp()
      .addField("Kullanıcı:", `${member} (${member.id})`)
      .addFiel("Sebep", "Muteliyken Sunucudan Çıkmak.");
    member.guild.channels.cache.get(modlog).send(embed);
  }
});
//Muteliyken sw den çıkana mute

client.on("message", msg => {
  client.emit("checkMessage", msg);
});

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yüklemeye hazırlanılıyor.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
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


client.on("message", async msg => {
  const i = await db.fetch(`ssaass_${msg.guild.id}`);
  if (i == "acik") {
    if (
      msg.content.toLowerCase() == "sa" ||
      msg.content.toLowerCase() == "s.a" ||
      msg.content.toLowerCase() == "selamun aleyküm" ||
      msg.content.toLowerCase() == "sea" ||
      msg.content.toLowerCase() == "selam"
    ) {
      try {
        return msg.channel.send(`Aleyküm Selam, Hoş Geldin ${msg.author.name}`);
      } catch (err) {
        console.log(err);
      }
    }
  } else if (i == "kapali") {
  }
  if (!i) return;
});

//////////////////////////////////////////////////

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

client.on("guildMemberRemove", async member => {
  const channel = db.fetch(`sayaçKanal_${member.guild.id}`);
  if (db.has(`sayacsayı_${member.guild.id}`) == false) return;
  if (db.has(`sayaçKanal_${member.guild.id}`) == false) return;

  member.guild.channels.cache
    .get(channel)
    .send(
      `📤 **${member.user.tag}** Sunucudan ayrıldı! \`${db.fetch(
        `sayacsayı_${member.guild.id}`
      )}\` üye olmamıza son \`${db.fetch(`sayacsayı_${member.guild.id}`) -
        member.guild.memberCount}\` üye kaldı!`
    );
});

//////çekiliş/////////..
if (!db.get("giveaways")) db.set("giveaways", []);

const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
  async getAllGiveaways() {
    return db.get("giveaways");
  }

  async saveGiveaway(messageID, giveawayData) {
    db.push("giveaways", giveawayData);
    return true;
  }

  async editGiveaway(messageID, giveawayData) {
    const giveaways = db.get("giveaways");
    const newGiveawaysArray = giveaways.filter(
      giveaway => giveaway.messageID !== messageID
    );
    newGiveawaysArray.push(giveawayData);
    db.set("giveaways", newGiveawaysArray);
    return true;
  }

  async deleteGiveaway(messageID) {
    const newGiveawaysArray = db
      .get("giveaways")
      .filter(giveaway => giveaway.messageID !== messageID);
    db.set("giveaways", newGiveawaysArray);
    return true;
  }
};
const manager = new GiveawayManagerWithOwnDatabase(client, {
  storage: false,
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    embedColor: "#0a99ff",
    reaction: "🎉"
  }
});
client.giveawaysManager = manager;

client.on("message", async msg => {
  if (msg.channel.type === "dm") return;
  if (msg.author.bot) return;
  if (msg.content.length > 1) {
    if (db.fetch(`capslock_${msg.guild.id}`)) {
      let caps = msg.content.toUpperCase();
      if (msg.content == caps) {
        if (!msg.member.permissions.has("ADMINISTRATOR")) {
          if (!msg.mentions.users.first()) {
            msg.delete();
            return msg.channel.send(`${msg.member}, sanırım capslock'un açık kalmış.`).then(nordx => nordx.delete({timeout: 5000}))
              
          }
        }
      }
    }
  }
});

client.on("message", message => {
  // Baş Tanımlar
  if (!message.guild) return;
  if (message.content.startsWith(ayarlar.prefix + "afk")) return;

  // Let Tanımları & Data Veri Çekme İşlemleri
  let codemarefiafk = message.mentions.users.first();
  let codemarefikisi = db.fetch(
    `kisiid_${message.author.id}_${message.guild.id}`
  );
  let codemarefikisiisim = db.fetch(
    `kisiisim_${message.author.id}_${message.guild.id}`
  );

  // Eğer Afk Kişi Etiketlenirse Mesaj Atalım
  if (codemarefiafk) {
    // Let Tanımları
    let cmfsebep = db.fetch(`cmfsebep_${codemarefiafk.id}_${message.guild.id}`);
    let codemarefikisi2 = db.fetch(
      `kisiid_${codemarefiafk.id}_${message.guild.id}`
    );

    if (message.content.includes(codemarefikisi2)) {
      const cmfbilgiafk = new Discord.MessageEmbed()
        .setDescription(
          `${message.author} - Etiketlemiş Olduğun <@!${codemarefikisi2}> Kişisi Şuan **${cmfsebep}** Sebebiyle AFK`
        )
        .setColor("#36393F")
        .setFooter("Afk Sistemi");
      message.channel.send(cmfbilgiafk);
    }
  }

  // Eğer Afk Kişi Mesaj Yazarsa Afk'lıktan Çıkaralım Ve Mesaj Atalım
  if (message.author.id === codemarefikisi) {
    // Datadaki AFK Kullanıcı Verilerini Silelim
    db.delete(`cmfsebep_${message.author.id}_${message.guild.id}`);
    db.delete(`kisiid_${message.author.id}_${message.guild.id}`);
    db.delete(`kisiisim_${message.author.id}_${message.guild.id}`);

    // Afk'lıktan Çıktıktan Sonra İsmi Eski Haline Getirsin
    message.member.setNickname(codemarefikisiisim);

    // Bilgilendirme Mesajı Atalım
    const cmfbilgiafk = new Discord.MessageEmbed()
      .setAuthor(
        `Hoşgeldin ${message.author.username}`,
        message.author.avatarURL({ dynamic: true, size: 2048 })
      )
      .setDescription(
        `<@!${codemarefikisi}> Başarılı Bir Şekilde **AFK** Modundan Çıkış Yaptın.`
      )
      .setColor("#36393F")
      .setFooter("Afk Sistemi");
    message.channel.send(cmfbilgiafk);
  }
});

//Küfür Engel
client.on("message", async msg => {
 
 
  const i = await db.fetch(`kufur_${msg.guild.id}`)
     if (i == "acik") {
         const kufur = ["küfürler","küfürler","küfürler",];
         if (kufur.some(word => msg.content.includes(word))) {
           try {
             if (!msg.member.hasPermission("BAN_MEMBERS")) {
                   msg.delete();
                           
                       return msg.reply('Bu Sunucuda Küfür Filtresi Aktiftir.')
             }             
           } catch(err) {
             console.log(err);
           }
         }
     }
     if (!i) return;
 });
 
 client.on("messageUpdate", (oldMessage, newMessage) => {
  
  
  const i = db.fetch(`${oldMessage.guild.id}.kufur`)
     if (i) {
         const kufur = ["küfürler","küfürler","küfürler",];
         if (kufur.some(word => newMessage.content.includes(word))) {
           try {
             if (!oldMessage.member.hasPermission("BAN_MEMBERS")) {
                   oldMessage.delete();
                           
                       return oldMessage.reply('Bu Sunucuda Küfür Filtresi Aktiftir.')
             }             
           } catch(err) {
             console.log(err);
           }
         }
     }
     if (!i) return;
 });

//Reklam Engel
client.on("message", async msg => {
  if(msg.author.bot) return;
  if(msg.channel.type === "dm") return;
      
  let i = await db.fetch(`reklamFiltre_${msg.guild.id}`)  
        if (i == 'acik') {
            const reklam = ["discord.app", "discord.gg", "invite","discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az",];
            if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
              try {
                if (!msg.member.hasPermission("MANAGE_GUILD")) {
                  msg.delete();                    
                  let embed = new Discord.RichEmbed()
                  .setColor(0xffa300)
                  .setFooter('$adis BOT  -|-  Reklam engellendi.', client.user.avatarURL)
                  .setAuthor(msg.guild.owner.user.username, msg.guild.owner.user.avatarURL)
                  .setDescription("$adis BOT Reklam sistemi, " + `***${msg.guild.name}***` + " adlı sunucunuzda reklam yakaladım.")
                  .addField('Reklamı yapan kişi', 'Kullanıcı: '+ msg.author.tag +'\nID: '+ msg.author.id, true)
                  .addField('Engellenen mesaj', msg.content, true)
                  .setTimestamp()                   
                  msg.guild.owner.user.send(embed)                       
                  return msg.channel.send(`${msg.author.tag}, Reklam Yapmak Yasak Lanet Zenci!`).then(msg => msg.delete(25000));
                }              
              } catch(err) {
                console.log(err);
              }
            }
        }
        if (!i) return;
        });

client.on("message", message => {
  // Data
  let sistem = db.fetch(`cmfsaas_${message.guild.id}`);

  // Sa
  var sa = [
    "Sa",
    "SA",
    "sa",
    "Sea",
    "sea",
    "SEA",
    "selamın aleyküm",
    "Selamın Aleyküm",
    "SELAMIN ALEYKÜm",
    "selamun aleyküm",
    "Selamun Aleyküm",
    "SELAMUN ALEYKÜM"
  ];

  if (sistem === "aktif") {
    if (sa.includes(message.content.toLowerCase())) {
      message.channel.send(
        `**Aleyküm Selam, hoşgeldin ${message.author}!**`
      );
    }
  } else {
    // Sistem Kapalıysa Bot İplemesin.
    return;
  }
});

client.on("message", message => {
  // Data
  let sistem = db.fetch(`cmfotocevap_${message.guild.id}`);

  // mesaj
  var sa = [
    "Günaydın",
    "GÜNAYDIN",
    "günaydın",
    "günaydıns",
    "Günaydıns",
    "GÜNAYDINN"
  ];

  if (sistem === "aktif") {
    if (sa.includes(message.content.toLowerCase())) {
      message.channel.send(
        `**Günaydın ${message.author}, ne güzel bir sabah değil mi?☀️**`
      );
    }
  } else {
    // Sistem Kapalıysa Bot İplemesin.
    return;
  }
});

client.on("message", message => {
  // Data
  let sistem = db.fetch(`cmfotocevap2_${message.guild.id}`);

  // mesaj
  var sa = [
    "İyi Geceler",
    "İYİ GECELER",
    "iyi geceler",
    "İyi geceler",
    "İyiGeceler",
    "İYİ GECELERR"
  ];

  if (sistem === "aktif") {
    if (sa.includes(message.content.toLowerCase())) {
      message.channel.send(
        `**İyi geceleeer ${message.author} :)**`
      );
    }
  } else {
    // Sistem Kapalıysa Bot İplemesin.
    return;
  }
});

client.login("ODk4ODI0NTAyNDYzNTYxNzQ4.YWp1jA.USE-eClAOB_wluOyM1-nT6TyGtg");
