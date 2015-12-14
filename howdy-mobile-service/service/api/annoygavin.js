exports.get = function(request, response) {
    // If the insert succeeds, send a notification to all devices 
    // registered to the logged-in user as a tag.
    var players = ['Russell Wilson','Richard Sherman','Earl Thomas','Marshawn Lynch','Kam Chancellor','Percy Harvin','Doug Baldwin']
    var player = players[Math.floor(Math.random()*players.length)]
    var payload = '<?xml version="1.0" encoding="utf-8"?><toast><visual>' +    
    '<binding template="ToastText01"><text id="1">Howdy! from ' + player +
     '</text></binding></visual></toast>';
    
    request.service.push.wns.send('Facebook:10204207455893286', payload, 'wns/toast', {
        success: function(pushResponse) {
            console.log("Sent push:", pushResponse);
            request.respond(200, {message: 'Gavin just got a message from ' + player});
        },              
        error: function (pushResponse) {
            console.log("Error Sending push:", pushResponse);
            request.respond(500, { error: pushResponse });
        }
    });
}

exports.post = function(request, response) {
    // If the insert succeeds, send a notification to all devices 
    // registered to the logged-in user as a tag.
    var message = request.body.message;
    if(message.length > 120) {
        message = message.substring(0,120);
    }
    var payload = '<?xml version="1.0" encoding="utf-8"?><toast><visual>' +    
    '<binding template="ToastText01"><text id="1">' + message +
     '</text></binding></visual></toast>';
    
    request.service.push.wns.send('Facebook:10204207455893286', payload, 'wns/toast', {
        success: function(pushResponse) {
            console.log("Sent push:", pushResponse);
            request.respond(200, {message: 'Gavin just got this message: ' + message});
        },              
        error: function (pushResponse) {
            console.log("Error Sending push:", pushResponse);
            request.respond(500, { error: pushResponse });
        }
    });
}
     