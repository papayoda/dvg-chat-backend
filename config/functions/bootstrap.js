'use strict';

let messages = [];

module.exports = async () => {
    process.nextTick(() => {
        if (strapi.server) {
            initio()
        } else {
            loop()
        }

        function loop() {
            if (strapi.server) {
                initio()
            } else {
                setTimeout(() => { }, 200);
            }
        }

        function initio() {
            const io = require('socket.io')(strapi.server, {
                path: '/socket.io',
                cors: {
                    origin: ["https://dvgchat.eu", "http://localhost:8080", "http://localhost:8081"],
                    methods: ["GET", "POST"]
                },
                serverClient: false,
                pingInterval: 10000,
                pingTimeout: 5000,
                cookie: false
            });
            io.on('connection', function (socket) {
                io.to(socket.id).emit('connected', 'Hola! You are connected');
                console.log('Socket Id: ', socket.id);
                socket.join('chatroom')

                socket.on('sendMessage', (message) => {
                    console.log('old messages', messages)
                    messages.push(message);
                    console.log(' messages', messages)
                    io.to('chatroom').emit('newMessage', message);
                })

                socket.on('getMessages', () => {
                    io.to(socket.id).emit('messages', messages);
                })

                socket.on('clearMessages', () => {
                    messages = [];
                    io.to('chatroom').emit('messages', messages);
                })
            })
        }
    })
};
