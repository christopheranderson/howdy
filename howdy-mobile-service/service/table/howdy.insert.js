function insert(item, user, request) {
    // Define a payload for the Windows Store toast notification.
    var payload = '<?xml version="1.0" encoding="utf-8"?><toast><visual>' +    
    '<binding template="ToastText01"><text id="1">Howdy! from ' + item.From +
     '</text></binding></visual></toast>';
     
    

    // Get the ID of the logged-in user.
    var userId =item.To;
    item.From = user.userId;
    
    var user = tables.getTable('User');
    user.where({
        id: item.To
    }).read({
        success:function(results) {
            var result = results[0]
            if(!result.business) {
                request.execute({
                    success: function() {
                        // If the insert succeeds, send a notification to all devices 
                        // registered to the logged-in user as a tag.
                            push.wns.send(userId, payload, 'wns/toast', {
                            success: function(pushResponse) {
                                console.log("Sent push:", pushResponse);
                                request.respond();
                                },              
                                error: function (pushResponse) {
                                        console.log("Error Sending push:", pushResponse);
                                    request.respond(500, { error: pushResponse });
                                    }
                                });
                            }
                        });
            }
            else {
                request.execute({
                    success: function() {
                        // If the insert succeeds, send a notification to all devices 
                        // registered to the logged-in user as a tag.
                            var businessPayload = '<?xml version="1.0" encoding="utf-8"?><toast><visual>' +    
                                '<binding template="ToastText01"><text id="1">' + result.Name + ' received your request!' +
                                 '</text></binding></visual></toast>';
                            push.wns.send(user.userId, businessPayload, 'wns/toast', {
                            success: function(pushResponse) {
                                console.log("Sent push:", pushResponse);
                                request.respond();
                                },              
                                error: function (pushResponse) {
                                        console.log("Error Sending push:", pushResponse);
                                    request.respond(500, { error: pushResponse });
                                    }
                                });
                            }
                        });
            }
        }
    })

    
}