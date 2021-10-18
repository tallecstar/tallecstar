const Discord = require('discord.js');

exports.run = async (client, message, args) => {


    let sebeb = args.join(" ");
    if(sebeb.length < 1) {
        return message.reply('AFK Sebebini Belirtmelisin.') //botun hata oldugunda verecegi mesaj
    } else {  
        message.delete()
        const afk = new  Discord.RichEmbed()
        .setColor('RANDOM') //embed renk kodu degiştirmek isterseniz buraya ekleyin
        .setTitle('AFK') //Başlık
        .setDescription(`${message.author.username} │ Adlı Kullanıcı **${sebeb}** Yüzünden Afk Oldu!`) //botun verdiği mesaj
        .setFooter('CodeMareFi AFK Sistem', client.user.avatarURL) //botun avatar ve foter alanı
        .setTimestamp() // zaman 
        message.channel.send(afk);
     
      }

     
     
  };

  exports.conf = {
      enabled: true, //komut kullanıma açık olup olmadıgı buradan ayarlanır
      guildOnly: false, // komutun sadee servera özel olup olmadıgını burdan ayarnalır
      aliases: ['afk', 'afkol'], // komut kullanım türleri
      permlevel: 0, // permleve bu ne işe yarar derseniz bu discord sunucu yetkiler demektir buraya göre bot kişiye cevam verir yada vermez bu detaylar CodeMareFi de anlatılacak
  };

  exports.help = {
      name: 'afkol', //komut ismi
      description: 'afk notu burakır', // komut açıklaması 
      usage: 'afkol' //komutun kullanım şekli {örnek ""$$afkol"}
  };