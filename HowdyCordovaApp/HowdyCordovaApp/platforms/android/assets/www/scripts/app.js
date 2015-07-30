(function () {
    var client = new WindowsAzure.MobileServiceClient(
        "https://howdy.azure-mobile.net/",
        "sDVFgwtwvUnzGProUDPQwrvhBIHahL22"
    );

    function refreshAuthDisplay() {
        var isLoggedIn = client.currentUser !== null;
        $("#logged-in").toggle(isLoggedIn);
        $("#logged-out").toggle(!isLoggedIn);

        if (isLoggedIn) {
            
            refreshUsers();
        }
    }

    function logIn() {
        client.login("facebook").then(refreshAuthDisplay, function (error) {
            alert(error);
        });
    }

    function logOut() {
        client.logout();
        refreshAuthDisplay();
        $('#summary').html('<strong>You must login to access data.</strong>');
    }

    // On page init, fetch the data and set up event handlers
    $(function () {
        refreshAuthDisplay();
        $('#summary').html('<strong>You must login to access data.</strong>');
        $("#logged-out button").click(logIn);
        $("#logged-in button").click(logOut);
    });

    function refreshUsers() {
        client.getTable("user").read().done(function (results) {
            var found = false;
            for (var i = 0; i < results.length; i++) {
                if (results[i].id === client.currentUser.userId) {
                    found = true;
                    $("#login-name").text(results[i].Name);
                }
            }
            if (!found) {
                registerUser();
            }
            var users = $.map(results, renderUserDiv);
            $('#main').empty().append(users);
        }, function (err) {

        });
    }

    function renderUserDiv(user) {
        if (user.id === client.currentUser.userId) {
            return;
        }
            
        return $('<div>')
            .css({
                'background-color': user.color
            })
            .attr('class','user-tab')
            .append($('<h1>')
            .append($('<a>'))
            .attr('href', '#')
            .attr('data-user',user.id)
            .html(user.Name));
    }

    function registerUser() {
        client.getTable("user").insert({ id: client.currentUser.userId }).done(function (results) {
            console.log(results);
            $("#login-name").text(results.Name);
        }, function (err) {
            console.log(err);
        });
    }
})();