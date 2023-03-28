const {ObjectId} = require("mongodb");
module.exports = function (app, commentRepo, songRepo) {

    app.post('/comments/:songId', async (req, res) => {
        const songId = req.params.songId
        const text = req.body.comment
        if (!text) {
            res.send('No se pueden guardar comentarios vacios')
        } else {
            const song = await songRepo.findSong({ _id: ObjectId(songId) }, {})
            if (!song) {
                res.send('No se puede añadir un comentario a una canción que no existe')
            } else {
                const newComment = {
                    author: req.session.user,
                    text,
                    song_id: song._id,
                }
                commentRepo.insertComment(newComment, (id, err) => {
                    if (err) {
                        res.send('Error al guardar el comentario ' + err)
                    } else {
                        res.redirect(`/songs/${songId}#${id}`)
                    }
                })
            }
        }
    })

}