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
            $("#login-name").text(client.currentUser.userId);
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
            var users = $.map(results, renderUserDiv);
            $('#main').empty().append(users)
        }, function (err) {

        });
    }

    function renderUserDiv(user){
        return $('<div>')
            .css({
                'background-color': user.color,
                'width':'100%'
            })
            .append($('<h1>').html(user.Name));
    }
})();