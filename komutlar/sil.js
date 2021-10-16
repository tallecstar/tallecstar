const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

exports.run = (Bot, Mesaj, Argüman) => {

if(db.fetch(`bakimmod`)) {

  if(message.author.id !== "683752128644251660") return message.channel.send('```Şuanlık Discord Botumuz Bakımdadır Lütfen Bir Kaç Saat Sonra Tekrar Deneyiniz```')

}

  const Sayı = Number(Argüman[0]);

  const Hata = new MessageEmbed()
    .setColor("#7f0000")
    .setTitle("Hata!")
    .setFooter(`${Mesaj.author.username} Tarafından İstendi.`,Mesaj.author.avatarURL());

  const Başarılı = new MessageEmbed()
    .setColor("#007f00")
    .setTitle("Başarılı!")
    .setFooter(`${Mesaj.author.username} Tarafından İstendi.`,Mesaj.author.avatarURL());
  {
    if (!Mesaj.member.hasPermission("MANAGE_MESSAGES")) {
      Hata.setDescription("Bu komutu kullanmak için `Mesajları Yönet` yetkisine sahip olmanız gerekmektedir.");
      Mesaj.channel.send(Hata).then(msg => msg.delete({ timeout: 5000}));
      
    } else {
      if (!Sayı) {
        Hata.setDescription("Bir sayı belirtiniz.");
        Mesaj.channel.send(Hata).then(msg => msg.delete({ timeout: 5000}));
      } else {
        if (Sayı < 101) {
          Başarılı.setDescription(`${Sayı} adet mesaj başarıyla silindi!`);
          Mesaj.channel.send(Başarılı).then(msg => msg.delete({ timeout: 5000}));
          Mesaj.channel.bulkDelete(Sayı);
        }
        if (Sayı > 100 && Sayı < 200) {
          Başarılı.setDescription(`${Sayı} adet mesaj başarıyla silindi!`);
          Mesaj.channel.send(Başarılı).then(msg => msg.delete({ timeout: 5000}));
          Mesaj.channel.bulkDelete(100).then(() => {
            Mesaj.channel.bulkDelete(Sayı - 100);
          });
        }
        if (Sayı == 200) {
          Başarılı.setDescription(`${Sayı} adet mesaj başarıyla silindi!`);
          Mesaj.channel.send(Başarılı).then(msg => msg.delete({ timeout: 12000}));
          Mesaj.channel.bulkDelete(100);
          Mesaj.channel.bulkDelete(100);
        }
        if (Sayı > 200 && Sayı < 300) {
          Başarılı.setDescription(`${Sayı} adet mesaj başarıyla silindi!`);
          Mesaj.channel.send(Başarılı).then(msg => msg.delete({ timeout: 5000}));
          Mesaj.channel.bulkDelete(100);
          Mesaj.channel.bulkDelete(100).then(() => {
            Mesaj.channel.bulkDelete(Sayı - 200);
          });
        }
        if (Sayı == 300) {
          Başarılı.setDescription(`${Sayı} adet mesaj başarıyla silindi!`);
          Mesaj.channel.send(Başarılı).then(msg => msg.delete({ timeout: 12000}));
          Mesaj.channel.bulkDelete(100);
          Mesaj.channel.bulkDelete(100);
          Mesaj.channel.bulkDelete(100);
        }
        if (Sayı > 300 && Sayı < 400) {
          Başarılı.setDescription(`${Sayı} adet mesaj başarıyla silindi!`);
          Mesaj.channel.send(Başarılı).then(msg => msg.delete({ timeout: 6000}));
          Mesaj.channel.bulkDelete(100);
          Mesaj.channel.bulkDelete(100);
          Mesaj.channel.bulkDelete(100).then(() => {
            Mesaj.channel.bulkDelete(Sayı - 300);
          });
        }
        if (Sayı > 300) {
          Hata.setDescription("En fazla 300 adet mesaj silebilirsiniz.");
          Mesaj.channel.send(Hata).then(msg => msg.delete({ timeout: 5000}));
        }
      }
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["Temizle", "sil", "temizle","sl" ],
  permLevel: 0
};

exports.help = {
  name: "sil"
};