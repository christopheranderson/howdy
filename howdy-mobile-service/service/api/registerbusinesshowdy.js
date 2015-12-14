exports.post = function(request, response) {
    var user = request.service.tables.getTable('User');
    var business = {
        Name: request.body.title,
        business: true,
        action: JSON.stringify(request.body)
    }
    user.insert(business);
    response.send(statusCodes.OK, { message : 'Hello World!' });
};