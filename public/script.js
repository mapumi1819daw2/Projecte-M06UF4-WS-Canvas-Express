var pressed = false;
var ctx = null;

var pos = {
    x : null,
    y : null,
};


window.addEventListener("load", inici, true);
window.addEventListener("mousedown", canviEstat);


function obtenirCoordenades(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    //console.log("x: " + x + " y: " + y);
    console.log(pressed);
        if(pressed){
            ctx.lineTo(x + 1, y + 1);
        }
        else{
            pos.x = evt.clientX;
            pos.y = evt.clientY;
        }
        
        ctx.stroke(); //finalitza i dibuixa
   
    
}

/* Funció que canvia entre estat pressionat i no pressionat */
function canviEstat(){
    pressed = !pressed;
    
    if(pressed){
        ctx.moveTo(pos.x, pos.y);
    }
    console.log("pressed "+ pressed);



}

/* FUnció inicial que crea el listener per captar el moviment del ratolí */
function inici() {
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');   
    }
    ctx.beginPath();
    canvas.addEventListener('mousemove', function
        (evt) {
        obtenirCoordenades(document.getElementById('canvas'), evt);
    }, false);
}

