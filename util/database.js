const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://akanksha:12345@practise-timpz.mongodb.net/shop?retryWrites=true&w=majority', 
        { useUnifiedTopology: true })
    .then(client => {
        console.log('CONNECTED to MongoDB');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No Database Found!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;