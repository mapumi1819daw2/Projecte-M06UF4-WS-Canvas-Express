var express = require("express");
var app = express();
var port = 8888;

app.use(express.static(__dirname + '/public'));
//Indiquem la carpeta vistes
app.set('views', __dirname+'/vistes');
//Indiquem el motor de la vista
app.set('view engine', "jade");

app.engine('jade', require('jade').__express);

app.get("/", function(req, res){
    res.render("canvas");
});


/* Socket */
io.sockets('connection', function(socket){
    //Enviem
    socket.emit('[Servidor envia]', {
                 missatge: "Holaa"
                });

    //Escoltem
    socket.on('envia', function(data){
        io.sockets.emit('missatge', data);
    });
    });
})

var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);