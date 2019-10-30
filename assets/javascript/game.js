var playername = prompt("What is your name?")

// Assign the reference to the database to a variable named 'database'
// var database = ...
var firebaseConfig = {
    apiKey: "AIzaSyC0nGXdHiDylNJ2e8_VGRsYZwafuHkVzmE",
    authDomain: "project-1471175096615895971.firebaseapp.com",
    databaseURL: "https://project-1471175096615895971.firebaseio.com",
    projectId: "project-1471175096615895971",
    storageBucket: "project-1471175096615895971.appspot.com",
    messagingSenderId: "48405276666",
    appId: "1:48405276666:web:dcd575ad683a4605a6e643"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  
  // Create a variable to reference the database
  // var database = ...
      // Get a reference to the database service
  var database = firebase.database();

  // -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {
console.log(snap.val());
  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push({connected: true,
        playername: playername});

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snapshot) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  console.log(snapshot.val());
  //$("#watchers").text(snapshot.numChildren());
  var objarray = snapshot.val();
  $.each(objarray,function() {
    if (this.playername !== playername)  {
        $("#watchers").text(this.playername);

    }

});


});


var chat = database.ref("/chats");
chat.on("value", function(snapshot) {
    resetChat();
    var objarray = snapshot.val();
    console.log(objarray);
    
    $.each(objarray,function() {
        insertChat("me", this.text);  

    });


  });

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //









var me = {};

var you = {};

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time = 0){
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == "me"){
        
        control = '<li style="width:100%">' +
                        '<div class="msj macro">' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';                    
    }else{
        control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"></div>' +                                
                  '</li>';
    }
    setTimeout(
        function(){                        
            $("ul").append(control);

        }, time);
    
}

function resetChat(){
    $("ul").empty();
}

$(".mytext").on("keyup", function(e){
    if (e.which == 13){
        var text = $(this).val();
        if (text !== ""){
            //insertChat("me", text);              
            //console.log(text);
            chat.push({playername: playername,
                text: text,
                time: formatAMPM(new Date())
            });
            this.value = "";
        }
    }
   
    //console.log($(".mytext").val());
  
});

//-- Clear Chat
resetChat();


//-- NOTE: No use time on insertChat.