module.exports = function (app) {
    app.get("/songs", (req, res) => {
        let response = ''
        if (req.query.title)
            response += `Título: ${req.query.title}<br>`
        if (req.query.author)
            response += `Autor: ${req.query.author}<br>`

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

    app.get('/add', function(req, res) {
        let response = parseInt(req.query.num1) + parseInt(req.query.num2);
        res.send(String(response));
    });

    app.post('/songs/add', function(req, res) {
        let response = `Canción agregada: ${req.body.title}<br>`+
            `genero: ${req.body.kind}<br>`+
            `precio: ${req.body.price}`

        res.send(response)
    })

    app.get('/promo*', function (req, res) {
        res.send('Respuesta al patrón promo*');
    });

    app.get('/pro*ar', function (req, res) {
        res.send('Respuesta al patrón pro*ar');
    });

    app.get('/', function (req, res) {
        res.send('root');
    });

    app.get('/about', function (req, res) {
        res.send('about');
    });

    app.get('/random.text', function (req, res) {
        res.send('random.text');
    });

    app.get('/ab?cd', function(req, res) {
        res.send('ab?cd');
    });

    app.get('/ab+cd', function(req, res) {
        res.send('ab+cd');
    });

    app.get('/ab*cd', function(req, res) {
        res.send('ab*cd');
    });

    app.get('/ab(cd)?e', function(req, res) {
        res.send('ab(cd)?e');
    });

    app.get(/a/, function(req, res) {
        res.send('/a/');
    });

    app.get(/.*fly$/, function(req, res) {
        res.send('/.*fly$/');
    });

}