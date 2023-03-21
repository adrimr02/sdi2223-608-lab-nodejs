module.exports = function (app) {
    app.get("/songs", (req, res) => {
        const songs = [
            {
                title: 'Blank space',
                price: '1.2'
            },
            {
                title: 'See you again',
                price: '1.3'
            },
            {
                title: 'Uptown funk',
                price: '1.1'
            },
        ]
        const response = {
            seller: 'Tienda de canciones',
            songs
        }
        res.render('shop.twig', response);
    })

    app.get('/songs/add', function(req, res) {
        res.render("add.twig");
    })

    app.post('/songs/add', function(req, res) {
        let response = ''
        if (req.body.title)
            response += `Título: ${req.body.title}<br>`
        if (req.body.author)
            response += `Autor: ${req.body.author}<br>`

        res.send(response);
    })

    app.get('/songs/:id', function(req, res) {
        let response = 'id: ' + req.params.id;
        res.send(response);
    });

    app.get('/songs/:kind/:id', function(req, res) {
        let response = 'id: ' + req.params.id + '<br>'
            + 'Tipo de música: ' + req.params.kind;
        res.send(response);
    });

}