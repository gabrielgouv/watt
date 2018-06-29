# watt
![Logo](https://i.imgur.com/4tJmY1F.jpg)
Logo by [dee-y](https://github.com/dee-y)

An opensource software for sending SimConnect data through WebSocket using Socket.io.

## How to
First things first, clone repo

``git clone https://github.com/jpedroh/watt.git``

Besides that, you need to use node-simconnect, a Node Module by @EvenAR. [Click here to access](https://github.com/EvenAR/node-simconnect).
After that, just compile the code usign ``pkg`` by typing.

``yarn run build``

Or

``npm run build``

Note: since node-simconnect is a native module, it must be provided together with the .exe file compiled.

Then, just point your socket.io client to ``http://localhost:5050`` and start using data.
