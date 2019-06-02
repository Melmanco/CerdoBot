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
  client.guilds.array().forEach((guild) => {
    console.log(" - " + guild)
  })
  // Says hi to server
  //cer2.general.send("k onda k pex");

  // Creates an object with all users $pokemon and pls work state
  // to know if it has to remind them to use it
  
  console.log('Generating userList');
  client.guilds.array().forEach((guild) => {

    guild.members.array().forEach((member) =>{

        userList[member.user] = {pokemon: false, work: false};

    })

  });
  console.log('Done');

});

client.on('message', async (message) => {
  
  var mStringNormal = message.content;
  var mString = message.content.toLowerCase();
  var mUser = message.author;
  var mUserString = message.author.toString().substring(1);
  var mChannel = message.channel;

  var userId = message.author.id;

  // Prevent bot from responding to reacting to its own message
  if (mUser.bot){ return;}
  
  // Command to know if CerdoBot is working
  if (mString == 'cerdobot?'){
    
   mChannel.send(':pig:');
     
  }

  // Reminder for $pokemon if haven't used $pokemon
  if (mString == '$pokemon' && !userList[mUser].pokemon){

    userList[mUser].pokemon = true;
    mChannel.send(mUserString + ' te voy a recordar capturar un pokemon en dos horas.');

    setTimeout(() => {

      mChannel.send(mUserString + ' ya puedes usar $pokemon otra vez!');

    }, timeToMilliseconds('2h'));

  }

  // Reminder for pls work if haven't used pls work
  if (mString == 'pls work' && !userList[mUser].work){

    userList[mUser].work = true;
    mChannel.send(mUserString + ' te voy a recordar trabajar en una hora.');
    setTimeout(() => {

      mChannel.send(mUserString + ' ya puedes trabajar de nuevo!');

    }, timeToMilliseconds('1h'));

  }

  var messageSplit = mString.split(/ +/g);
  var prefix = messageSplit.shift();
  var command = messageSplit.shift();
  var args = messageSplit;


  if (!(prefix == 'cerdobot!' || prefix == 'cb!')){return;}

  // Main command for CerdoBot
  else{
    

    if (command == 'reset' && args[0]){

      // Resets all user data
      if (args[0] == 'all'){

        message.guild.members.array().forEach((member) =>{

          userList[member.user] = {pokemon: false, work: false};

        });

        mChannel.send('Reinicié los recordatorios de todos.');

      }

      // Resets a specific user data
      else if(args[0] in userList){

        userList[args[0]]  = {pokemon: false, work: false};
        mChannel.send('Reinicié los recordatorios de ' + mUserString + '.');

      }

    }
  }

  // Replies to messages at #prueba-bots
  /*if (message.channel.id == cer2.pruebaBots.id){
    cer2.pruebaBots.send(message.author.toString() + " dijo " + message.content);
  }*/

  

});
  
client.login(botToken);

client.on('disconnect', async () => {

  client.destroy();
  client.login(botToken);

});

client.on('error',(err) => console.log(err));