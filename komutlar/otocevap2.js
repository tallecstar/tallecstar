const Discord = require("discord.js");
const db = require("quick.db");

exports.run = (client, message, args) => {
  // Aç
  if (args[0] === "aç") {
    db.set(`cmfotocevap2_${message.guild.id}`, "aktif");

    // Mesaj
    const codemarefi = new Discord.MessageEmbed()
      .setDescription(`**OtoCevap, Sistemi Başarıyla Aktif Hale Getirdim.**`)
      .setColor("#00ff00");
    message.channel.send(codemarefi);
  }

  // Kapat
  if (args[0] === "kapat") {
    db.delete(`cmfotocevap2_${message.guild.id}`);

    // Mesaj
    const codemarefi = new Discord.MessageEmbed()
      .setDescription(`**Sistemi Başarıyla Devre Dışı Bıraktım.**`)
      .setColor("#ff0000");
    message.channel.send(codemarefi);
  }
}; 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["Oto-Cevap2", "Oto-cevap2", "OTO_CEVAP2", "oto-Cevap2", "oto-CEVAP2"],
  permLevel: 0
};

exports.help = {
  name: "oto-cevap2"
};