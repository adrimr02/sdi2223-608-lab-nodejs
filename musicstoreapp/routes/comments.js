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

    app.get('/comments/delete/:id', async (req, res) => {
        const commentId = ObjectId(req.params.id)
        const comment = await commentRepo.findComment({ _id: commentId },{})
        if (!comment) {
            res.send('No se encontró el comentario')
        } else {
            console.log(req.session.user, comment.author)
            if (req.session.user !== comment.author){
                res.send('Debes ser el propietario de un comentario para borrarlo')
            } else {
                commentRepo.deleteComment({ _id: commentId },{})
                    .then(() => {
                        res.redirect(`/songs/${comment.song_id}`)
                    })
                    .catch(() => {
                        res.send('Error al eliminar el comentario')
                    })
            }
        }
    })

}