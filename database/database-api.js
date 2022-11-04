var MongoClient = require('mongodb').MongoClient;
var db;

// Initialize connection once
module.exports = {
    dbConnect: () => MongoClient.connect("mongodb://localhost:27017", function(err, database) {
        if(err) throw err;
        db = database.db('internal');
    }),

    test: () => console.log(db),

    adminLookUp: () => db.collection("admin").find({}).toArray(),

    scoreLookUp: (ind) => db.collection("score").find(ind===undefined ? {} : {gameIndex: parseInt(ind)}).toArray(),

    scoreUpdate: (ind, score) => 
        db.collection("score").remove({gameIndex: parseInt(ind)}).then(_ => db.collection("score").insertOne(score)),

    logLookUp: (ind) => db.collection("log").find(ind===undefined ? {} : {gameIndex: parseInt(ind)}).toArray(),

    addLog: (log) => db.collection("log").insertOne(log)
}

