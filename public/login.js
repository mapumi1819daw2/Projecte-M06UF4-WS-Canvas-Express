

$(function(){

    var dirname = "http://localhost:8888/jugar/";
   
    /* Fem el login */
   $("#login").on("click", function(){
        var nom = $("#nom").val();

        dirname+= nom;
       
        $.ajax({
            url: dirname,
            type: "GET",
            dataType: "html",
            success: function (data){
                /* Revem el canvas.jade */

                /* Substitum html */
               var login = document.open("texthtml", "replace");
               login.write(data);
               login.close();

                
                
            },

            error: function (xr, status, error){
                    alert("xr: "+JSON.stringify(xr));
                    console.log("status "+status);
                    console.log("error "+error);
            }
        });
   });

});