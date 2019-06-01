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
var userList = {};
 
// Transforms seconds, minutes, hours or days
// with the form 'quantityFormat' to milliseconds 
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

  // Creates an object with all users $pokemon and pls work state
  // to know if it has to remind them to use it
  client.users.forEach((user) => {

    userList[user] = {pokemon: false, work: false};

  })

})

client.on('message', (message) => {
  
  // Prevent bot from responding to reacting to its own message
  if (message.author == client.user){ return;}
  
  // Replies to messages at #prueba-bots
  /*if (message.channel.id == cer2.pruebaBots.id){
    cer2.pruebaBots.send(message.author.toString() + " dijo " + message.content);
  }*/

  // Reminder for $pokemon if haven't used $pokemon
  if (message.content == '$pokemon' && !userList[message.author][pokemon]){

    userList[message.author][pokemon] = true;
    message.channel.send(message.author.toString() + ' te voy a recordar capturar un pokemon en dos horas');

    setTimeout(() => {

      message.channel.send(message.author.toString() + ' ya puedes usar $pokemon otra vez!');

    }, timeToMilliseconds('2h'));

  }

  // Reminder for pls work if haven't used pls work
  if (message.content == 'pls work' && !userList[message.author][work]){

    userList[message.author][pokemon] = true;
    message.channel.send(message.author.toString() + ' te voy a recordar trabajar en una hora');
    setTimeout(() => {

      message.channel.send(message.author.toString() + ' ya puedes trabajar de nuevo!');

    }, timeToMilliseconds('1h'));

  }

});
  
client.login(botToken);