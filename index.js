const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, Token } = require('./config.json');
const { quotes } = require('./Soundfiles/sounds.json');

var isReady = true;
var soundFile = '';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  console.log(message.content);
  const msg = message.content
  soundFile ='';
  if (isReady) {
    if (msg.startsWith(`${prefix} laugh`) || msg.startsWith(`${prefix} die`) || msg.startsWith(`${prefix} Q`)) {
      var randomNumber = (Math.floor(Math.random() * 4) + 1).toString()
      var soundEffect = msg.slice(5);
      soundFile = quotes[soundEffect][randomNumber];
    } else {
      for (var keyname in quotes) {
        if (msg.startsWith(`${prefix} ${keyname}`)) {
          soundFile = quotes[keyname];
        }
      };
    };
    var voiceChannel = message.member.voice.channel;
    if (soundFile !== '') { join(voiceChannel, soundFile); };
  };
  if (msg.startsWith(`${prefix} stop`)) {
    var voiceChannel = message.member.voice.channel;
    if(voiceChannel !== null) { leave(voiceChannel); };
  }
});

function join (voiceChannel, soundFile) {
  if (voiceChannel !== null) {
    voiceChannel.join().then(async connection => {
      isReady = false;
      console.log(`Connected!`);
      const dispatcher = await play(connection, soundFile);
      dispatcher.on(`finish`, end => {
        console.log(`I finished playing`);
        leave(voiceChannel);
      });
    }).catch(err => console.log(err));
  }
}

function play (connection, soundFile) {
  return connection.play(soundFile);
}

function leave (voiceChannel) {
  voiceChannel.leave();
  isReady = true;
}

client.login(Token);
