var simConnect = require('./simconnect')
var app = require('http').createServer()
var io = require('socket.io')(app)

const RECONNECTION_TIMEOUT = 5000;
const SERVER_PORT = 5050;

initialize();

function initialize() {
    connectToSim();
    configureServer();
}

function configureServer() {
    app.listen(SERVER_PORT);
    openSocketConnection();
}

function openSocketConnection() {
    io.on('connection', () => {
        console.log('Conectado com sucesso ao Mach');
        sendData();
    })
}

// Send data through WebSocket
function sendData() {
    simConnect.requestDataOnSimObject([
        ["Plane Latitude", "degrees"],
        ["Plane Longitude", "degrees"],  
        ["PLANE ALTITUDE", "feet"],
        ["PLANE HEADING DEGREES MAGNETIC", "radians"],
        ["GROUND VELOCITY", "knots"]
    ], (data) => {
        io.emit('airplaneData', {
            lat: data["Plane Latitude"],
            lng: data["Plane Longitude"],
            altitude: data["PLANE ALTITUDE"],
            speed: data["GROUND VELOCITY"],
            heading: (180*data["PLANE HEADING DEGREES MAGNETIC"])/Math.PI,
        });
    }, 
    simConnect.objectId.USER,
    simConnect.period.SECOND,
    simConnect.dataRequestFlag.CHANGED
    );
}

// Open connection
function connectToSim() {
    console.log("Tentando conectar ao simulador")
    var success = simConnect.open("Watt", (simName, scVersion) => console.log(`\nConnectado com sucesso ao: ${simName}. SimConnect version = ${scVersion}`), 
    () => {
        console.log("Simulador fechado pelo usuario");
        connectToSim();
    }, (exception) => {
        console.log("SimConnect exception: " + exception.name + " (" + exception.dwException + ", " + exception.dwSendID + ", " + exception.dwIndex + ", " + exception.cbData + ")");
    }, (error) => {
        console.log("SimConnect error: " + error);
        connectToSim();
    });
    if(!success) {
        reconnectToSim();
    }
}

function reconnectToSim() {
    setTimeout(() => {
        connectToSim();
    }, RECONNECTION_TIMEOUT);
}