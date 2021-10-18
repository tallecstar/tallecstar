const Discord = require("discord.js");
const db = require("quick.db");

exports.run = (client, message, args) => {
  // Aç
  if (args[0] === "aç") {
    db.set(`saas_${message.guild.id}`, "aktif");

    // Mesaj
    const codemarefi = new Discord.MessageEmbed()
      .setDescription(`**Selam, Sistemi Başarıyla Aktif Hale Getirdim.**`)
      .setColor("#00ff00");
    message.channel.send(codemarefi);
  }

  // Kapat
  if (args[0] === "kapat") {
    db.delete(`saas_${message.guild.id}`);

    // Mesaj
    const codemarefi = new Discord.MessageEmbed()
      .setDescription(`**Sistemi Başarıyla Devre Dışı Bıraktım.**`)
      .setColor("#ff0000");
    message.channel.send(message);
  }
}; // CODEMAREFİ - MAREFİ
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["Sa-As", "Sa-as", "SA-AS", "sa-As", "sa-AS"],
  permLevel: 0
};

exports.help = {
  name: "sa-as"
};
