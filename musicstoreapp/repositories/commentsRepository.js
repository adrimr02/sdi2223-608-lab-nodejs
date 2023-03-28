module.exports = {
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this. mongoClient= mongoClient
        this.app = app
    },
    insertComment: function (comment, callback) {
        this.mongoClient.connect(this.app.get('connectionStrings'), function (err, dbClient) {
            if (err) {
                callback(null, err)
            } else {
                const database = dbClient.db("sdi-music-store")
                const collectionName = 'comments'
                const songsCollection = database.collection(collectionName)
                songsCollection.insertOne(comment)
                    .then(result => callback(result.insertedId))
                    .then(() => dbClient.close())
                    .catch(err => {
                        console.log(err)
                        callback(null, {error: err.message})
                    })
            }
        })
    },
    getComments: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdi-music-store");
            const collectionName = 'comments';
            const commentsCollection = database.collection(collectionName);
            return await commentsCollection.find(filter, options).toArray();
        } catch (error) {
            throw (error);
        }
    },
    findComment: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdi-music-store");
            const collectionName = 'comments';
            const commentsCollection = database.collection(collectionName);
            return await commentsCollection.findOne(filter, options);
        } catch (error) {
            throw (error);
        }
    },
    deleteComment: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("sdi-music-store");
            const collectionName = 'comments';
            const commentsCollection = database.collection(collectionName);
            await commentsCollection.deleteOne(filter, options);
        } catch (error) {
            throw error;
        }
    }
}