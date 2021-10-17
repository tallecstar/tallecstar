const reqEvent = (event) => require(`../events/${event}`);
module.exports = client => {
  client.on('voiceStateUpdate', () => reqEvent('voiceStateUpdate')(client));
  client.on('message', reqEvent('message'));
};