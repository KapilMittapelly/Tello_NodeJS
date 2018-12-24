const dgram = require('dgram');
const wait = require('./waait');
const commandDelays = require('./commandDelays');


const PORT = 8889;
const HOST = '192.168.10.1';
const tello = dgram.createSocket('udp4');
tello.bind(PORT);

tello.on('message', message => {
    console.log(`Tello says : ${message}`);
});

function handleError(err) {
    if (err) {
        console.log('ERROR');
        console.log(err);
    }
}

//tello.send('command', 0, 'command'.length, PORT, HOST, handleError);
//tello.send('battery?', 0, 8, PORT, HOST, handleError);

const commands = ['command', 'battery?', 'takeoff', 'flip f', 'land'];
let i = 0;

async function go() {
    try {
        let command = commands[i];
        let delay = commandDelays[command];
        if (!delay) {
            console.log(`Did not find delay for ${command}`);
            delay = 7000;
        }
        console.log(`running command: ${command}`);
        tello.send(command, 0, command.length, PORT, HOST, handleError);
        await wait(delay);
        i += 1;
        if (i < commands.length) {
            return go();
        }
        console.log('done!');
    } catch (err) {
        console.log(`Error is ${err}`);
    }
}
go();

console.log("Started");