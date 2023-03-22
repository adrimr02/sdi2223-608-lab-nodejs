const songsRepository = require("../repositories/songsRepository");
module.exports = function (app, songsRepository) {
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
        res.render('shop.twig', response)
    })

    app.get('/songs/add', function(req, res) {
        res.render("add.twig")
    })

    app.post('/songs/add', function(req, res) {
        let song = {
            title: req.body.title,
            kind: req.body.kind,
            price: req.body.price,
        }
        songsRepository.insertSong(song, (songId, err) => {
            if (!songId) {
                res.send("Error al insertar la canción")
            } else {
                res.send('Agregada la cancion ID: ' + songId)
            }
        })

    })

    app.get('/songs/:id', function(req, res) {
        let response = 'id: ' + req.params.id
        res.send(response)
    });

    app.get('/songs/:kind/:id', function(req, res) {
        let response = 'id: ' + req.params.id + '<br>'
            + 'Tipo de música: ' + req.params.kind
        res.send(response)
    });

}