function insert(item, user, request) {
    var colors = ['#BA4C63','#EFC84A','#E0FB49','#337AB7','#5CB85C','#5BC0DE','#F0AD4E','#D9534F']
    item.color = colors[Math.floor(Math.random()*(colors.length))];
    item.Name = "<unknown>"; // default 
    
    user.getIdentities({
        success: function (identities) {
            var req = require('request');
            if (identities.facebook) {
                var fbAccessToken = identities.facebook.accessToken;
                var url = 'https://graph.facebook.com/me?access_token=' + fbAccessToken;
                req(url, function (err, resp, body) {
                    if (err || resp.statusCode !== 200) {
                        console.error('Error sending data to FB Graph API: ', err);
                        request.respond(statusCodes.INTERNAL_SERVER_ERROR, body);
                    } else {
                        try {
                            var userData = JSON.parse(body);
                            item.Name = userData.name;
                            request.execute();
                        } catch (ex) {
                            console.error('Error parsing response from FB Graph API: ', ex);
                            request.respond(statusCodes.INTERNAL_SERVER_ERROR, ex);
                        }
                    }
                });
            } else {
                // Insert with default user name
                request.execute();
            }
        }
    });
}