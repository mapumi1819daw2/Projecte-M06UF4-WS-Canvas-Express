var express = require("express");
var app = express();
var port = 8888;

var partides = [];


class Partida {
    constructor(id, Jugadors){
        this.id = id; 
        this.Jugadors = Jugadors;
        this.quantJugadors = this.Jugadors.length;
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
    res.render("canvas");
});

var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);


/* Socket */
io.sockets.on('connection', function(socket){
    //Enviem
    socket.emit('[Servidor envia]', {
                 missatge: "Holaa"
                });

    //Escoltem
    socket.on('envia', function(data){
        io.sockets.emit('missatge', data);
    });
   
})

