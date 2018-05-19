var simConnect = require('./simconnect')
var app = require('http').createServer()
var io = require('socket.io')(app)

// Try to connect to simulator
connectToSim()

// Configures server
app.listen(5050)
io.on('connection', () => {
    console.log('Conectado com sucesso ao Mach')
    sendData()
})

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
        })
    }, 
    simConnect.objectId.USER,
    simConnect.period.SECOND,
    simConnect.dataRequestFlag.CHANGED
    )
}

// Open connection
function connectToSim() {
    console.log("Tentando conectar ao simulador")
    var success = simConnect.open("Watt", (simName, scVersion) => console.log(`\nConnectado com sucesso ao: ${simName}. SimConnect version = ${scVersion}`), 
    () => {
        console.log("Simulador fechado pelo usuario");
        connectToSim()
    }, (exception) => {
        console.log("SimConnect exception: " + exception.name + " (" + exception.dwException + ", " + exception.dwSendID + ", " + exception.dwIndex + ", " + exception.cbData + ")");
    }, (error) => {
        console.log("SimConnect error: " + error);
        connectToSim();
    })
    if(!success) {
        setTimeout(() => {
            connectToSim();
        }, 5000);
    }
}