'use strict';

const EAGLE_GUILD_ID = '487343475445202944';

function setupDiscordDm(protocol, client, tag){
  let member = client.guilds.get(EAGLE_GUILD_ID).members.find(m => m.user.tag === tag);
  if(member !== null) {
    protocol.send({
      type: 0,
      content: {
        discordId: member.user.id,
      },
    });
  }else{
    protocol.send({
      type: 1,
      content: {
        message: 'Error in setupDiscordDm() [BOT]',
      },
    });
  }
}

function sendPing(protocol, client, id){
  client.fetchUser(id).then(user => {
    user.send('Pong').then(() => protocol.send({
      type: 0,
      content: {},
    })).catch(err => protocol.send({
      type: 1,
      content: {
        message: err.toString(),
      },
    }));
  }).catch(err => protocol.send({
    type: 2,
    content: {
      message: err.toString(),
    },
  }));
}

module.exports = {
  setupDiscordDm,
  sendPing,
};