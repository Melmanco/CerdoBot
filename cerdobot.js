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

  client.user.setActivity('Cerdeando con ' + client.users.size + ' cerdos.');

  // Creates an object with all users $pokemon and pls work state
  // to know if it has to remind them to use it
  
  console.log('Generating userList');
  client.guilds.array().forEach((guild) => {

    guild.members.array().forEach((member) =>{

        userList[member.user] = {pokemon: null, work: null,reminders:[]};

    })

  });
  console.log('Done');

});

client.on('message', async (message) => {
  
  var mStringNormal = message.content;
  var mString = message.content.toLowerCase();
  var mUser = message.author;
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

    mChannel.send(mUser.username + ' te voy a recordar capturar un pokemon en dos horas.');

    userList[mUser].pokemon = setTimeout(() => {

      userList[mUser].pokemon = false;
      mChannel.send(mUser.toString() + ' ya puedes usar $pokemon otra vez!');

    }, timeToMilliseconds('2h'));

  }

  // Reminder for pls work if haven't used pls work
  if (mString == 'pls work' && !userList[mUser].work){

    mChannel.send(mUser.username + ' te voy a recordar trabajar en una hora.');
    userList[mUser].work = setTimeout(() => {

      userList[mUser].work = false;
      mChannel.send(mUser.toString() + ' ya puedes trabajar de nuevo!');

    }, timeToMilliseconds('1h'));

  }

  var messageSplit = mString.split(/ +/g);
  var prefix = messageSplit.shift();
  var command = messageSplit.shift();
  var args = messageSplit;


  if (!(prefix == 'cerdobot!' || prefix == 'cb!')){return;}

  // Main command for CerdoBot
  else{
    

    if (command == 'reset'){

      if (args.length == 1){

        // Resets all user data
        if (args[0] == 'all'){

          message.guild.members.array().forEach((member) =>{

            clearTimeout(userList[member.user].pokemon);
            clearTimeout(userList[member.user].work);
            userList[member.user].reminders.forEach((reminder) => clearTimeout(reminder));
            userList[member.user].reminders = [];

          });

          mChannel.send('Reinicié los recordatorios de todos.');

        }

        // Resets a specific user data
        else if(args[0] in userList){

          clearTimeout(userList[args[0]].pokemon);
          clearTimeout(userList[args[0]].work);
          userList[args[0]].reminders.forEach((reminder) => clearTimeout(reminder));
          userList[args[0]].reminders = [];
          mChannel.send('Reinicié los recordatorios de ' + args[0] + '.');

        }
        else{mChannel.send('Para usar reset debes escribir:\ncerdobot! reset (@usuario, o all si quieres reiniciar todo).');}
      }
      else{mChannel.send('Para usar reset debes escribir:\ncerdobot! reset (@usuario, o all si quieres reiniciar todo).');}
    }

    // Custom reminder
    else if (command == 'remind'){

      var timeoutString = args.pop()
      var timeoutList = timeoutString.split(':');
      var userReminded = args.shift();
      var reminder = args.join(' ');
      var timeout = 0;
      timeoutList.forEach((time) => {

        timeout += timeToMilliseconds(time);

      });

      if (userReminded in userList && timeout > 1){

        mChannel.send('Recordatorio en ' + timeoutString + ' guardado para ' + userReminded + ':\n' + reminder);
        userList[userReminded].reminders.push(setTimeout(() => {

          mChannel.send(userReminded + '! recuerda:\n' + reminder);

        }, timeout));
      }

      else{
        mChannel.send('Para usar remind debes escribir:\ncerdobot! remind (@usuario) (recordatorio) (tiempo)');
        mChannel.send('Ejemplo, si quieres recordarte ir al baño en una hora y media debes escribir:\ncerdobot! remind ' + mUser.toString() + ' ir al baño 1h:30m');
      }
    }

    else if (command == 'help') {

      mChannel.send('Para saber si estoy funcionando usa:\n' +
                    'cerdobot?\n' +
                    '----------------------------------------------------------------------\n' +
                    'Para usar reset debes escribir:\ncerdobot! reset (@usuario, o all si quieres reiniciar todo).\n' +
                    '----------------------------------------------------------------------\n' +
                    'Para usar remind debes escribir:\ncerdobot! remind (@usuario) (recordatorio) (tiempo)\n' +
                    'Ejemplo, si quieres recordarte ir al baño en una hora y media debes escribir:\ncerdobot! remind ' + mUser.toString() + ' ir al baño 1h:30m\n' +
                    '----------------------------------------------------------------------\n' +
                    'Y siempre que uses $pokemon o pls work te voy a recordar usarlos de nuevo!\n'
      );

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