module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this. mongoClient= mongoClient
        this.app = app
    },
    insertSong: function (song, callbackFunction) {
        this.mongoClient.connect(this.app.get('connectionStrings'), function (err, dbClient) {
            if (err) {
                callbackFunction(null, err)
            } else {
                const database = dbClient.db("sdi-music-store")
                const collectionName = 'songs'
                const songsCollection = database.collection(collectionName)
                songsCollection.insertOne(song)
                    .then(result => callbackFunction(result.insertedId))
                    .then(() => dbClient.close())
                    .catch(err => {
                        console.log(err)
                        callbackFunction(null, {error: err.message})
                    })
            }
        })
    },
    getSongs: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdi-music-store");
            const collectionName = 'songs';
            const songsCollection = database.collection(collectionName);
            const songs = await songsCollection.find(filter, options).toArray();
            return songs;
        } catch (error) {
            throw (error);
        }
    },
    findSong: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdi-music-store");
            const collectionName = 'songs';
            const songsCollection = database.collection(collectionName);
            const song = await songsCollection.findOne(filter, options);
            return song;
        } catch (error) {
            throw (error);
        }
    },
    updateSong: async function(newSong, filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdi-music-store");
            const collectionName = 'songs';
            const songsCollection = database.collection(collectionName);
            const result = await songsCollection.updateOne(filter, {$set: newSong}, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },
}