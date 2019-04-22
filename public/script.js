var pressed = false;
var ctx = null;

var pos = {
    x: null,
    y: null,
};

var nomJugador = null;
var numSala = null;
var sala = null;

/* Llista de jugadors */
var llistaJugadors = [];

var pinto = false;

/* Web Sockets */
var missatges = [];
var socket = null;

/* Caixa de missatges */
var contingut = null;
var textEnviar = null;
var botoEnviar = null;


window.addEventListener("load", inici, true);



/* Funció que va llegint les coordenades del ratolí */
function obtenirCoordenades(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    //console.log("x: " + x + " y: " + y);
    console.log(pressed);
    if (pressed) {
        ctx.lineTo(x + 1, y + 1);

        /* Enviem les coordenades del moviment */
        socket.emit("coordenadesFi", {
            nom: nomJugador,
            coordX: x,
            coordY: y
        });
    } else {
        pos.x = evt.clientX;
        pos.y = evt.clientY;
    }

    ctx.stroke(); //finalitza i dibuixa


}

/* Funció que canvia entre estat pressionat i no pressionat */
function canviEstat() {
    pressed = !pressed;

    if (pressed) {
        socket.emit("coordenadesInici", {
            nom: nomJugador,
            coordIniX: pos.x,
            coordIniY: pos.y
        });
        ctx.moveTo(pos.x, pos.y);
    }
    console.log("pressed " + pressed);



}

/* FUnció inicial que crea el listener per captar el moviment del ratolí */
function inici() {



    canvas.addEventListener("mousedown", canviEstat);

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    }
    ctx.beginPath();
    canvas.addEventListener("mousedown mouseup", function mouseState(e) {
        if (e.type == "mousedown") {
            console.log("clicat");
        }
    });

    if (pinto) {
        canvas.addEventListener('mousemove', function (evt) {
            obtenirCoordenades(document.getElementById('canvas'), evt);
        }, false);
    }


    inicialitzaVariables();
    demanaInfoInicial();
    inicialitzaWebSocket();
}





function inicialitzaVariables() {
    nomJugador = document.getElementById("nom").innerText;
    sala = document.getElementById("sala");


    socket = io.connect("http://localhost:8888");
    contingut = document.getElementById("contingut");
    textEnviar = document.getElementById("entrada");
    botoEnviar = document.getElementById("enviar");
}


function demanaInfoInicial() {

    socket.emit("infoInicial", {
        nom: nomJugador,
    });


    socket.on("infoInicial", function (data) {
        console.warn("Info inicial");
        numSala = data.codiPartida;
        sala.innerText= "Sala: "+ numSala;
        console.log(JSON.stringify(data));

        if (data.pinta) {
            document.getElementById("encert").removeAttribute("hidden");
            pinto = true;

            encert.addEventListener("click", function (){
                for(var i =0; i <llistaJugadors.length; i++){
                    if(document.getElementById(llistaJugadors[i]).checked){
                        console.log(" clic "+llistaJugadors[i]);

                        alert("Be "+llistaJugadors[i]);
                    }
                }
            });

            canvas.addEventListener('mousemove', function (evt) {
                obtenirCoordenades(document.getElementById('canvas'), evt);
            }, false);


            /* Demanem la llista de jugadors */
            socket.emit("jugadors", {
                codi: data.codiPartida
            });

            socket.on("jugadors", function (data) {
                console.log(JSON.stringify(data));
                dibuixaInputsJugadors(data);
            });




        } else {
            pinto = false;
        }
    });


}


/* Funció que mostra la llista dels jugadors que participen */
function dibuixaInputsJugadors(data) {


    var html = '';

    var t = data.jugadors.length;
   
        if(nomJugador !=data.jugadors[t-1].nom){
            llistaJugadors.push(data.jugadors[t-1].nom);
            html += '<input id="'+data.jugadors[t-1].nom+ '" type="radio" value="'+data.jugadors[t-1].nom+'">'+data.jugadors[t-1].nom;
        }

        
    jugadors.innerHTML += html;


}

function inicialitzaWebSocket() {

    /* Escoltar */
    escoltarWS();

    enviarWS();

}

function escoltarWS() {
    socket.on("NouMissatge", function (data) {
        if (data.missatge) {

            console.log(data.missatge);
            missatges.push(data.missatge);

            var html = '';
            for (var i = 0; i < missatges.length; i++) {
                html += "En " + data.nom + " diu: " + missatges[i] + '<br />';
            }

            contingut.innerHTML = html;




        } else {
            console.log("Error amb el missatge rebut");
        }
    });


    socket.on("coordenadaServidorInici", function (data) {
        ctx.moveTo(data.coordIniX, data.coordIniYs);
    });



    socket.on("coordenadaServidorFi", function (data) {
        ctx.lineTo(data.coordX, data.coordY);
        ctx.stroke(); //finalitza i dibuixa

    });
}


function enviarWS() {


    /*  console.log("nom "+nom); */

    botoEnviar.onclick = function () {
        // pressed = !pressed;
        var m = textEnviar.value;


        socket.emit("clientEnvia", {
            nom: nomJugador,
            missatge: m
        });
    };

}