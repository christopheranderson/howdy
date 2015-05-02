var request = require('request');
var url = require('url');

var deals = {
    'sams-cakes': {
        title: 'Serious Sam\'s Cakes',
        subtitle: 'Serious Cakes - Seriously Fast',
        img: '/img/portfolio/cake.png',
        form: [
            {
                name: 'address',
                title: 'Full address (one line)',
                def: 'Address'
            },
            {
                name: 'cake',
                title: 'Cake Flavor',
                def: 'e.g. Chocoloate, Vanilla, Carrot, Butterscotch, Turnip'
            }
        ],
        action: ""
    }
}

module.exports = function (app) {
    // Display All Partners
    app.get('/partners', function (req, res) {
        res.render('partners', { title: 'Partners' });
    });

    app.get('/partners/:name', function (req, res) {
        var deal = deals[req.params.name];
        if (!deal) {
            return res.status(404);
        }
        res.locals.submitted = false;
        res.render('partnerpage', deal);
    });

    app.post('/partners/:name', function (req, res) {
        var deal = deals[req.params.name];
        if (!deal) {
            return res.status(404);
        }
        var payload = {title: deal['title']};
        for (var i = 0; i < deal.form.length; i++) {
            payload[deal.form[i].name] = req.body[deal.form[i].name];
        }
        var options = {
            url: "https://howdy.azure-mobile.net/api/registerbusinesshowdy",
            form: payload
        }
        request.post(options, function (err, response, body) {
            console.log(response.statusCode);
            console.log(err);
        })
        res.locals.submitted = true;
        res.render('partnerpage', deal)
    });
}