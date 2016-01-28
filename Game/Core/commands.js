(function(r) {
    "use strict";

    var modules = {
        data: r('./data').data,
        helper: r('./helpers'),
        fs: r('fs'),
        world: {
            valston: r('../World/valston/prison')
        },
  events: r('./events.js')
    };

    var commands = {
        yes: function(string) {
            return string.toLowerCase().match(/^(y|yes|yea|yeah|sure|fine|okay|aye|yep|ok)$/)
        },
        no: function(string) {
            return string.toLowerCase().match(/^(n|no|never|nah|nay)$/)
        },
        parseInput: function(pc) {

            var socket = pc.getSocket();

            socket.on('data', function(input) {

                var str = input.toString().toLowerCase().trim();
                //command  //preposition //item
                //Look    //at/on/in     //sign
                var command = str.split(' ').slice(0, 2).join(' ');

                var item = str.split(' ').slice(2).join(' ');

                if (item == null || item == '') {
                    console.log("item is null");
                    //at / in not used. eg: look sword
                    command = str.split(' ').slice(0, 1).join(' ');
                    item = str.split(' ').slice(1).join(' ');
                }

                console.log(command)
                console.log(item)

                var commandTable = {

                    n: function() {socket.removeAllListeners('data'); socket.emit('North', modules.events.events.move(pc, 'North', null))},
                    north: function() {socket.removeAllListeners('data'); socket.emit('North',  modules.events.events.move(pc, 'North', null))},
                    e: function() {socket.removeAllListeners('data'); socket.emit('East',  modules.events.events.move(pc, 'East', null))},
                    east: function() {socket.removeAllListeners('data'); socket.emit('East', modules.events.events.move(pc, 'East', null))},
                    s: function() {socket.removeAllListeners('data');  socket.emit('South', modules.events.events.move(pc, 'South', null))},
                    south: function() {socket.removeAllListeners('data'); socket.emit('South', modules.events.events.move(pc, 'South', null))},
                    w: function() {socket.removeAllListeners('data'); socket.emit('West', modules.events.events.move(pc, 'West', null))},
                    west: function() {socket.removeAllListeners('data'); socket.emit('West', modules.events.events.move(pc, 'West', null)) },
                    d: function() {socket.removeAllListeners('data'); socket.emit('Down', modules.events.events.move(pc, 'Down', null))},
                    down: function() {socket.removeAllListeners('data'); socket.emit('Down', modules.events.events.move(pc, 'Down', null))},
                    u: function() {socket.removeAllListeners('data'); socket.emit('Up', modules.events.events.move(pc, 'Up', null))},
                    up: function() {socket.removeAllListeners('data'); socket.emit('Up', modules.events.events.move(pc, 'Up', null)) },
                    //Interaction
                    l: function() { socket.emit('Look',modules.events.events.look(socket, pc, null, item))},
                    look: function() { socket.emit('Look',modules.events.events.look(socket, pc, null, item))  },
                    "look at": function() { socket.emit('Look at',modules.events.events.look(socket, pc, 'at', item))  },
                    'look in': function() {socket.emit('Look in', modules.events.events.look(socket, pc, 'in', item))  },
                    ex: function () { socket.emit('Examine Item', modules.events.events.exam(socket, pc, item)) },
                    exam: function () { socket.emit('Examine Item', modules.events.events.exam(socket, pc, item)) },
                    examine: function () { socket.emit('Examine Item', modules.events.events.exam(socket, pc, item)) },
                    exits: function() {  console.log('look')  },
                    "'": function () { socket.emit('Say', modules.events.events.say(socket, pc, item)) },
                    say: function () { socket.emit('Say', modules.events.events.say(socket, pc, item)) },
                    score: function() { socket.emit('Score', modules.events.events.score(socket, pc))  },
                    i: function() {  console.log('Inventory')  },
                    inv: function() {  console.log('Inventory')  },
                }

                function processUserInput(command) {
                    if (commandTable.hasOwnProperty(command))
                    {
                        commandTable[command]();
                    }
                     else
                    {
 
                      modules.helper.helpers.send(socket, "Sorry " + command + " is not recognised command");

                    }
                }

                processUserInput(command);


            });

        }
    };
    exports.commands = commands;
})(require);
