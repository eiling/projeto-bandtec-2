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

module.exports = {
  setupDiscordDm,
};