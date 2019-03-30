var express = require("express");
var app = express();
var port = 8888;

var partides = [];


class Partida {
    constructor(id){
        this.id = id; 
        this.jugadors = [];
        this.quantJugadors = this.jugadors.length;
        this.maxJugadors = 4;
    }

}

class Jugador {
    constructor(nom, puntsPartida, puntsTotal){
        this.nom = nom;
        this.puntsPartida = puntsPartida;
        this.puntsTotal = puntsTotal;
    }
}


function assignaPartida(nom){

    var numPartides = partides.length;

    /* Cap partida */
    if(numPartides == 0){
        jugador = new Jugador(nom, 0, 0);
        novaPartida = new Partida(numPartides+1);
        novaPartida.jugadors.push(jugador);
        partides.push(novaPartida);

        console.log(partides[0]);
        
    }
}

app.use(express.static(__dirname + '/public'));

//Indiquem la carpeta vistes
app.set('views', __dirname+'/vistes');

//Indiquem el motor de la vista
app.set('view engine', "jade");

app.engine('jade', require('jade').__express);


app.get("/", function(req, res){
    res.render("login");
});

app.get("/jugar/:nom", function (req, res){
    var nom = req.params.nom;
    console.log("nom "+nom);
    assignaPartida(nom);
    res.render("canvas", {"jugador" : nom});
});

var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);


/* Socket */

io.sockets.on('connection', function(socket){

    //Escoltem, coordenades
    socket.on("coordenadesInici", function(data){
        console.log("coordenadesInici", JSON.stringify(data));
        socket.emit('coordenadaServidorInici', data); 
        socket.broadcast.emit("coordenadesInici", data);
    });


    socket.on("coordenadesFi", function(data){
        console.log("coordenadesFi", JSON.stringify(data));
        socket.emit('coordenadaServidorFi', data); 
        socket.broadcast.emit("coordenadaServidorFi", data);
    });

    //Enviem
    socket.emit('[Servidor envia]', {
                 missatge: "Holaa"
                });

    //Escoltem missatges
    socket.on('clientEnvia', function(data){
        console.log("Rebo "+JSON.stringify(data));
        
        socket.emit('NouMissatge', data); //Responem a qui ha enviat
        socket.broadcast.emit("NouMissatge", data); //A la resta
    });
   
})

