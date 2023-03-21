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


    app.get("/authors/filter/:role", (req, res) => {
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
            authors: authors.filter(author => author.role === req.params.role)
        }
        res.render('authors/authors.twig', response)
    })

    app.get('/authors/add', (req, res) => {

        const roles = [
            {
                value: 'singer',
                text: 'Cantante',
            },
            {
                value: 'guitar',
                text: 'Guitarrista',
            },
            {
                value: 'bass',
                text: 'Bajista',
            },
            {
                value: 'drummer',
                text: 'Bateria',
            },
            {
                value: 'pianist',
                text: 'Pianista',
            },
        ]

        res.render("authors/add.twig",{
            roles
        })
    })

    app.post('/authors/add', (req, res) => {
        let response = ''
        if (req.body.name)
            response += `Nombre: ${req.body.name}<br>`
        else
            response += `Nombre no enviado en la petición<br>`
        if (req.body.group)
            response += `Grupo: ${req.body.group}<br>`
        else
            response += `Grupo no enviado en la petición<br>`

        if (req.body.role)
            response += `Rol: ${req.body.role}<br>`
        else
            response += `Rol no enviado en la petición<br>`

        res.send(response)
    })

    app.get('/authors/*', (req, res) => {
        res.redirect('/authors')
    })

}