exports.register = function (registration, registrationContext, done) {   
    // Get the ID of the logged-in user.
    var userId = registrationContext.user.userId;    

    // Perform a check here for any disallowed tags.
    if (!validateTags(registration))
    {
        // Return a service error when the client tries 
        // to set a user ID tag, which is not allowed.      
        done("You cannot supply a tag that is a user ID");      
    }
    else{
        // Add a new tag that is the user ID.
        registration.tags.push(userId);

        // Complete the callback as normal.
        done();
    }
};

function validateTags(registration){
    for(var i = 0; i < registration.tags.length; i++) { 
        console.log(registration.tags[i]);           
        if (registration.tags[i]
        .search(/facebook:|twitter:|google:|microsoft:/i) !== -1){
            return false;
        }
        return true;
    }
}