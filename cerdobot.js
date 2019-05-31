
const discord = require('discord.js');
const client = new discord.Client();
const botToken = "NTgzOTAwNDQyMTM2Njc0MzA2.XPDGKw.6x13PVWSAbkt_VoVQYQoQg71iYA";
const cer2 = {
  get general() {
      return client.channels.get("548659630260092979");
  },
  get pruebaBots() {
      return client.channels.get("583470609388798089");
  }
};

function timeToMilliseconds(time){

  var format = time.charAt(time.length - 1);
  var time = parseInt(time.substring(0,time.length - 1),10);

  time *= 1000;
  if (format == 's') return time;
  time *= 60;
  if (format == 'm') return time;
  time *= 60;
  if (format == 'h') return time;
  time *= 24;
  if (format == 'd') return time;

  console.log('Debes ingresar un formato para transformar a milisegundos');
  return 1;

}

client.on('ready', () => {
  // List servers the bot is connected to
  console.log("Connected as " + client.user.tag + " to servers:")
  client.guilds.forEach((guild) => {
    console.log(" - " + guild)
  })
  // Says hi to server
  //cer2.general.send("k onda k pex");
})

client.on('message', (message) => {
  
  // Prevent bot from responding to reacting to its own message
  if (message.author == client.user){ return;}
  
  if (message.channel.id == cer2.pruebaBots.id){
    cer2.pruebaBots.send(message.author.toString() + " dijo " + message.content);
  }

  if (message.content == '$pokemon'){

    setTimeout(() => {

      message.channel.send(message.author.toString() + " ya puedes usar $pokemon otra vez!");

    }, timeToMilliseconds('2h'));

  }

});
  
client.login(botToken);