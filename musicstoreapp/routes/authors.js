module.exports = function(app) {

    app.get("/authors", (req, res) => {
        const authors = [
            {
                name: 'Angus Young',
                group: 'AC/DC',
                role: 'guitar'
            },
            {
                name: 'Dan Raynolds',
                group: 'Imagine Dragons',
                role: 'singer'
            },
            {
                name: 'Billie Joe Armstrong',
                group: 'Green Day',
                role: 'singer'
            },
        ]
        const response = {
            authors
        }
        res.render('authors/authors.twig', response)
    })

    app.get('/authors/add', (req, res) => {
        res.render("authors/add.twig")
    })

    app.post('/authors/add', (req, res) => {
        let response = ''
        if (req.body.name)
            response += `Título: ${req.body.title}<br>`
        if (req.body.author)
            response += `Autor: ${req.body.author}<br>`

        res.send(response)
    })

    app.get('/authors/**', (req, res) => {
        res.redirect('/authors')
    })

}