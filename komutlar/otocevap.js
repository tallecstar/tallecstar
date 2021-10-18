const Discord = require("discord.js");
const db = require("quick.db");

exports.run = (client, message, args) => {
  // Aç
  if (args[0] === "aç") {
    db.set(`cmfotocevap_${message.guild.id}`, "aktif");

    // Mesaj
    const codemarefi = new Discord.MessageEmbed()
      .setDescription(`**OtoCevap, Sistemi Başarıyla Aktif Hale Getirdim.**`)
      .setColor("#00ff00");
    message.channel.send(codemarefi);
  }

  // Kapat
  if (args[0] === "kapat") {
    db.delete(`cmfotocevap_${message.guild.id}`);

    // Mesaj
    const codemarefi = new Discord.MessageEmbed()
      .setDescription(`**Sistemi Başarıyla Devre Dışı Bıraktım.**`)
      .setColor("#ff0000");
    message.channel.send(codemarefi);
  }
}; // CODEMAREFİ - MAREFİ
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["Oto-Cevap", "Oto-cevap", "OTO_CEVAP", "oto-Cevap", "oto-CEVAP"],
  permLevel: 0
};

exports.help = {
  name: "oto-cevap"
};