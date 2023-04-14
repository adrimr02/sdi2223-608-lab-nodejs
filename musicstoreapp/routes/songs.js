const {ObjectId} = require("mongodb");
module.exports = function (app, songsRepository, commentRepo) {
  
  app.get('/shop', (req, res) => {
    let filter = {}
    let options = {sort: { title: 1}}
    
    if(req.query.search){
      filter.title = { $regex: `.*${req.query.search}.*` }
    }
    
    let page = req.query.page || 1
    songsRepository.getSongsPg(filter, options, page).then(result => {
      let lastPage = result.total / 4
      if (result.total % 4 > 0) {
        lastPage = lastPage + 1
      }
      let pages = []; // paginas mostrar
      for (let i = page - 2; i <= page + 2; i++) {
        if (i > 0 && i <= lastPage) {
          pages.push(i)
        }
      }
      let response = {
        songs: result.songs,
        pages: pages,
        currentPage: page
      }
      res.render("shop.twig", response)
    })
    .catch(error => {
      res.send("Se ha producido un error al listar las canciones " + error)
    })
  })
  
  app.get('/songs/add', function(req, res) {
    res.render("songs/add.twig")
  })
  
  app.post('/songs/add', function(req, res) {
    let song = {
      title: req.body.title,
      kind: req.body.kind,
      price: req.body.price,
      author: req.session.user
    }
    songsRepository.insertSong(song, (songId, err) => {
      if (!songId) {
        res.send("Error al insertar la canción")
      } else {
        if (req.files) {
          let imagen = req.files.cover
          imagen.mv(app.get("uploadPath") + '/public/covers/' + songId + '.png', function (err) {
            if (err) {
              res.send("Error al subir la portada de la canción")
            } else {
              if (req.files.audio != null) {
                let audio = req.files.audio
                audio.mv(app.get("uploadPath") + '/public/audios/' + songId + '.mp3', function (err) {
                  if (err) {
                    res.send("Error al subir el audio")
                  } else {
                    res.redirect("/publications")
                  }
                })
              }
            }
          })
        } else {
          res.redirect("/publications")
        }
      }
    })
    
  })
  
  app.get('/songs/edit/:id', function (req, res) {
    let filter = { _id: ObjectId(req.params.id) }
    songsRepository.findSong(filter, {})
    .then(song => {
      console.log(song)
      res.render('songs/edit', { song })
    })
    .catch(error => {
      res.send('Se ha producido un error al recuperar la canción ' + error)
    })
  })
  
  app.post('/songs/edit/:id', function (req, res) {
    let song = {
      title: req.body.title,
      kind: req.body.kind,
      price: req.body.price,
      author: req.session.user
    }
    let songId = req.params.id
    let filter = { _id: ObjectId(songId) }
    //que no se cree un documento nuevo, si no existe
    const options = { upsert: false }
    songsRepository.updateSong(song, filter, options)
    .then(result => {
      step1UpdateCover(req.files, songId, function (result) {
        if (result == null) {
          res.send("Error al actualizar la portada o el audio de la canción")
        } else {
          res.redirect("/publications");
        }
      })
    })
    .catch(error => {
      res.send("Se ha producido un error al modificar la canción " + error)
    })
  })
  
  app.get('/songs/delete/:id', function (req, res) {
    let filter = {_id: ObjectId(req.params.id)};
    songsRepository.deleteSong(filter, {}).then(result => {
      if (result === null || result.deletedCount === 0) {
        res.send("No se ha podido eliminar el registro")
      } else {
        res.redirect("/publications")
      }
    }).catch(error => {
      res.send("Se ha producido un error al intentar eliminar la canción: " + error)
    });
  })
  
  app.get('/songs/buy/:id', async function (req, res) {
    let songId = ObjectId(req.params.id)
    
    const song = await songsRepository.findSong({ _id: songId }, {})
    if (!song) {
      res.redirect('/shop?message=No se ha encontrado la canción&messageType=alert-danger')
      return
    }

    const purchased = await songsRepository.getPurchases({songId: (songId), user: req.session.user}, {})
    if (purchased.length > 0) {
      res.redirect(`/songs/${songId}?message=Ya has comprado esta canción&messageType=alert-danger`)
      return
    }


    if (song.author === req.session.user) {
      res.redirect(`/songs/${songId}?message=No puedes comprar tu propia canción&messageType=alert-danger`)
      return
    }

    let shop = {
      user: req.session.user,
      songId: songId
    }
    songsRepository.buySong(shop, function (shopId) {
      if (shopId == null) {
        res.redirect(`/songs/${songId}?message=Error al realizar la compra&messageType=alert-danger`)
      } else {
        res.redirect("/purchases")
      }
    })
  })
  
  app.get('/songs/:id', function(req, res) {
    let filter = { _id: ObjectId(req.params.id) }
    let options = {}
    let settings = {
      url: "https://www.freeforexapi.com/api/live?pairs=EURUSD",
      method: "get",
      headers: {
        "token": "ejemplo",
      }
    }
    songsRepository.findSong(filter, options).then( async song => {
      const comments = await commentRepo.getComments({ song_id: ObjectId(song._id) },{})
      const purchased = await songsRepository.getPurchases({songId: song._id, user: req.session.user}, {})
      let rest = app.get("rest");
      rest(settings, function (error, response, body) {
        console.log("cod: " + response.statusCode + " Cuerpo :" + body);
        let responseObject = JSON.parse(body);
        let rateUSD = responseObject.rates.EURUSD.rate;
        // nuevo campo "usd" redondeado a dos decimales
        let songValue= rateUSD * song.price;
        song.usd = Math.round(songValue * 100) / 100;
        res.render("songs/song.twig", { song, comments, owns: song.author === req.session.user || purchased.length > 0 })
      })
    }).catch(error => {
      res.send("Se ha producido un error al buscar la canción " + error)
    })
  })
  
  app.get('/publications', function(req, res) {
    let filter = { author: req.session.user }
    let options = { sort: { title:1 } }
    songsRepository.getSongs(filter, options)
    .then(songs => {
      res.render('publication.twig', { songs })
    })
    .catch(error => {
      res.send("Se ha producido un error al listar las publicaciones del usuario:" + error)
    })
  })
  
  app.get('/purchases', function (req, res) {
    let filter = { user: req.session.user };
    let options = { projection: {_id: 0, songId: 1} };
    songsRepository.getPurchases(filter, options).then(purchasedIds => {
      let purchasedSongs = [];
      for (let i = 0; i < purchasedIds.length; i++) {
        purchasedSongs.push(purchasedIds[i].songId)
      }
      let filter = {"_id": {$in: purchasedSongs}};
      let options = {sort: {title: 1}};
      songsRepository.getSongs(filter, options).then(songs => {
        res.render("purchases.twig", {songs: songs});
      }).catch(error => {
        res.send("Se ha producido un error al listar las publicaciones del usuario: " + error)
      });
    }).catch(error => {
      res.send("Se ha producido un error al listar las canciones del usuario " + error)
    });
  })
  
  
  function step1UpdateCover(files, songId, callback) {
    if (files && files.cover != null) {
      let image = files.cover;
      image.mv(app.get("uploadPath") + '/public/covers/' + songId + '.png', function (err) {
        if (err) {
          callback(null); // ERROR
        } else {
          step2UpdateAudio(files, songId, callback); // SIGUIENTE
        }
      });
    } else {
      step2UpdateAudio(files, songId, callback); // SIGUIENTE
    }
  };
  function step2UpdateAudio(files, songId, callback) {
    if (files && files.audio != null) {
      let audio = files.audio;
      audio.mv(app.get("uploadPath") + '/public/audios/' + songId + '.mp3', function (err) {
        if (err) {
          callback(null); // ERROR
        } else {
          callback(true); // FIN
        }
      });
    } else {
      callback(true); // FIN
    }
  };
}