/*
 * Copyright© Will Benedetti 2019-2020
 */

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
  /*
   * Plays Yasuo voice sound effects from League of Legends.
   * Determine the voice command requested, and the voice channel the guild member is currently in.
   * Join the members current voice channel and play the SFX, then leave the voice channel.
   */
  if (isReady) {
    // TODO:
    // Map to check for specific keynames that have numerous soundfiles
    // Check the keyname first, and determine the number of keys contained (1-n)
    // Use it to determine the max number in the Math.random to make it dynamic
    if (msg.startsWith(`${prefix} laugh`) || msg.startsWith(`${prefix} die`) || msg.startsWith(`${prefix} Q`)) {
      var randomNumber = (Math.floor(Math.random() * 4) + 1).toString()
      var soundEffect = msg.slice(5); // Slice off the prefix, _yas, to get the specific keyname
      soundFile = quotes[soundEffect][randomNumber];
    } else {
      for (var keyname in quotes) {
        if (msg.startsWith(`${prefix} ${keyname}`)) { // A one-to-one voice command match
          soundFile = quotes[keyname];
        }
      };
    };
    var voiceChannel = message.member.voice.channel;
    if (soundFile !== '') { join(voiceChannel, soundFile); };
  };
  /*
   * Leave the channel and stop playing
   */
  if (msg.startsWith(`${prefix} stop`)) {
    var voiceChannel = message.member.voice.channel;
    if(voiceChannel !== null) { leave(voiceChannel); };
  }
  /*
   * Display help block on how to use the Yasuo Bot
   */
  if (msg.startsWith(`${prefix} help`)) {
    var commandString = `\`\`\``
    message.channel.send(`Here are my voice commands:\n_Always_ prefix with **_yas[space][command]**\n`)
    Object.keys(quotes).forEach(function(key) {
      commandString += (`${key}\n`) // Append the string so all commands fit in a discord code-block on their own lines for human readability
    })
    commandString += `\`\`\``
    message.channel.send(commandString)
    message.channel.send(`Use **_yas stop** to make me shut up :\`\)`)
  }
});
/*
 * Function to have the Yasuo Bot join the appropriate voice channel and dispatch the desired SFX
 */
function join (voiceChannel, soundFile) {
  if (voiceChannel !== null) {
    voiceChannel.join().then(async connection => {
      // Set isReady to false to prevent the Yasuo Bot from command spamming. Will ignore incoming voice commands until the current one has finished playing.
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
/*
 * Function to play the audio file in the voice channel
 */
function play (connection, soundFile) {
  return connection.play(soundFile);
}
/*
 * Function to remove the Yasuo Bot from a voice channel
 */
function leave (voiceChannel) {
  voiceChannel.leave();
  // Reset the Yasuo Bot for the next command
  isReady = true;
}

client.login(Token);
