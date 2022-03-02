const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const {performance} = require('perf_hooks');

const app = express();
const port = 3000;

const http = require("http").createServer(app);

const io = require("socket.io")(http, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

// Static directories
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use('/3d', express.static(__dirname + 'public/3d'));
app.use('/font', express.static(__dirname + 'public/font'));

// For the post method
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded());

app.set('views', './views');
app.set('view engine', 'ejs');

// Requests
app.get('/', (req, res) => {
	res.render('index');
});

http.listen(port, () => {
	console.log("Listening on port " + port);
});



const players = [];

function updatePlayer(_index, _name, _position, _rotation) {
	players[_index] = {index: _index, name: _name, position: _position, rotation: _rotation};
}

io.on('connection', (socket) => {
	socket.on('registerPlayer', (_position, _rotation) => {
		let index = 0;
		if (players.length > 0){
			index = players.length;
		}
		let playerName = "Player" + index;
		let playerIndex = index;
		updatePlayer(playerIndex, playerName, _position, _rotation);
		socket.emit('playerRegistered', players[playerIndex]);
	});
	
	socket.on('updatePosition', (_index, _name, _position, _rotation) => {
		updatePlayer(_index, _name, _position, _rotation);
		// socket.broadcast.emit('updatePlayers', players);

	});
	socket.on('log', (_log) => {
		console.log(_log);
	});
	function Run() {
		let t1 = performance.now();
		Schedule_(t1);
	}

	function Schedule_(t1) {
		setTimeout(() => {
			let t2 = performance.now();
			Update_((t2 - t1) * 0.001);
			Schedule_(t2);
		});
	}

	function Update_(timeElapsed) {
		socket.broadcast.emit('updatePlayers', players);
	}
	Run();
});


