module.exports = function (app) {
    app.get("/songs", (req, res) => {
        let response = ''
        if (req.query.title)
            response += `Título: ${req.query.title}<br>`
        if (req.query.author)
            response += `Título: ${req.query.author}<br>`

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
}