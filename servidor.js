var express = require("express");
var app = express();
var port = 8888;

var partides = [];


class Partida {
    constructor(id) {
        this.id = id;
        this.pintor = 0;
        this.jugadors = [];
        this.maxJugadors = 4;
    }

}

class Jugador {
    constructor(nom, puntsPartida, puntsTotal) {
        this.nom = nom;
        this.codiPartida = null;
        this.puntsPartida = puntsPartida;
        this.puntsTotal = puntsTotal;
        this.pinta = false;
    }
}


function assignaPartida(nom) {

    var numPartides = partides.length;
<<<<<<< HEAD
    var numJugadors = 2;
=======
    var limitJugadors = 2;
>>>>>>> 0bcc67aa91983948c5bae3ac56395268abad4388

    /* Cap partida */
    if (numPartides == 0) {
        jugador = new Jugador(nom, 0, 0);
        jugador.pinta = true;
        jugador.codiPartida = numPartides;
        novaPartida = new Partida(numPartides);
        novaPartida.jugadors.push(jugador);
        partides.push(novaPartida);

        console.log(partides[0]);
    } else {
        var lliure = true;
        for (var i = 0; i < numPartides; i++) {

            if (partides[i].jugadors.length == numJugadors) {
                lliure = false;

                console.log("Partida plena");
            }
            /* Si la partida no arriba a 4 jugadors */
            if (partides[i].jugadors.length < numJugadors) {
                lliure = true;
                console.log("Partida lliure");
                jugador = new Jugador(nom, 0, 0);
                jugador.codiPartida = i;
                partides[i].jugadors.push(jugador);
            }
        }

        if (!lliure) {
            console.log("nova Partida lliure");
            jugador = new Jugador(nom, 0, 0);
            jugador.pinta = true;
            jugador.codiPartida = numPartides-1;
            novaPartida = new Partida(numPartides-1);
            novaPartida.jugadors.push(jugador);
            partides.push(novaPartida);

        }
    }
}

app.use(express.static(__dirname + '/public'));

//Indiquem la carpeta vistes
app.set('views', __dirname + '/vistes');

//Indiquem el motor de la vista
app.set('view engine', "jade");

app.engine('jade', require('jade').__express);






app.get("/", function (req, res) {
    res.render("login");
});





app.get("/jugar/:nom", function (req, res) {
    var nom = req.params.nom;
    console.log("nom " + nom);
    assignaPartida(nom);
    res.render("canvas", {
        "jugador": nom
    });
});





var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);


/* Socket */

io.sockets.on('connection', function (socket) {



    /* Info inicial */
    socket.on("infoInicial", function (data) {
        var n = data.nom;

        for(var i =0; i< partides.length; i++){
            for(var x =0; x < partides[i].jugadors.length; x++){
                if(partides[i].jugadors[x].nom == n){
                
                    socket.emit('infoInicial', partides[i].jugadors[x]);

                    /* Per cada login enviem info dels jugadors al que te el control */
                    socket.broadcast.emit("jugadors", {"jugadors": partides[i].jugadors});
                }
            }
        }
        

    });


    /* El que pinta demana la llista de jugadors */
    socket.on("jugadors", function (data) {
        console.warn("Jugadors");
        console.log(JSON.stringify(data));
        socket.emit("jugadors", {"jugadors": partides[data.codi].jugadors});
    });

    //Escoltem, coordenades
    socket.on("coordenadesInici", function (data) {
        console.log("coordenadesInici", JSON.stringify(data));
        socket.emit('coordenadaServidorInici', data);
        socket.broadcast.emit("coordenadesInici", data);
    });


    socket.on("coordenadesFi", function (data) {
        console.log("coordenadesFi", JSON.stringify(data));
        socket.emit('coordenadaServidorFi', data);
        socket.broadcast.emit("coordenadaServidorFi", data);
    });

    //Enviem
    socket.emit('[Servidor envia]', {
        missatge: "Holaa"
    });

    //Escoltem missatges
    socket.on('clientEnvia', function (data) {
        console.log("Rebo " + JSON.stringify(data));

        socket.emit('NouMissatge', data); //Responem a qui ha enviat
        socket.broadcast.emit("NouMissatge", data); //A la resta
    });

})