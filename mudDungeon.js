import { EventEmitter } from 'events';
import { createServer } from 'http';
import io from 'socket.io';
import fs from 'fs';
import telnet from 'wez-telnet';
import { playerSetup } from './Game/Core/player-setup';
import { player } from './Game/Core/PlayerSetup/player-manager';
import { time } from './Game/Core/Events/time';

const telnetPort = 4000;
const webPort = 4001;
const eventEmitter = new EventEmitter();

// create the telnet server
const server = new telnet.Server((socket) => {
  console.log('Telnet Player connected');

  socket.emit('welcome', modules.playerSetup.welcome(socket));
  socket.on('close', () => {

    // modules.playerSetup.player.playerManager.removePlayer(socket);
    // modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, pc, region, area, areaId);

    console.log("Telnet Player disconnected");
  });

  socket.on('interrupt', function () {
    socket.write("INTR!");
    // disconnect on CTRL-C!
    socket.end();
  });
});

// create the web server
const webServer = createServer(() => {
  fs.readFile(__dirname + '/Public/index.htm', (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.htm');
    }

    res.writeHead(200);
    res.end(data);
  });
});
const socketIo = io(webServer);

eventEmitter.on('updateTime', modules.time);
eventEmitter.emit('updateTime');

server.listen(telnetPort);
webServer.listen(webPort);

socketIo.sockets.on('connection', (socket) => {
  console.log('Web Player connected');

  socket.emit('welcome', modules.playerSetup.welcome(socket));
  socket.on('disconnect', function () {

    // modules.playerSetup.player.playerManager.removePlayer(socket);
    //modules.playerSetup.player.playerManager.removePlayerFromRoom(socket, pc, region, area, areaId);

    console.log("Web Player disconnected");
  });
});

socketIo.on('disconnect', () => {
  console.log('Web Player disconnected');
});

io.on('disconnect', () => {
  console.log("Web Player disconnected");
});

