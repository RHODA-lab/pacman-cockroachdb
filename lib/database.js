'use strict';

var MongoClient = require('mongodb').MongoClient;
var serviceBindings = require('kube-service-bindings');
var config = require('./config');
var _db;

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/drivers/node/ for more details
 */
let bindings;
try {
        // check if the deployment has been bound to a pg instance through
        // service bindings. If so use that connect info
        bindings = serviceBindings.getBinding('MONGODB', 'mongodb');
        console.log('check bindings');
        console.log(bindings);
} catch (err) { // proper error handling here
        console.log(err);
};    

const url = bindings.url + '/pacman?retryWrites=true&w=majority';
console.log('check url');
console.log(url);
console.log(bindings.connectionOptions);

function Database() {
    this.connect = function(app, callback) {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */

          MongoClient.connect(url,
                                bindings.connectionOptions,
                                function (err, db) {
                                    if (err) {
                                        console.log(err);
                                        console.log(url);
                                        console.log(bindings.connectionOptions);
                                    } else {
                                        _db = db;
                                        app.locals.db = db;
                                        console.log(db);
                                    }
                                    callback(err);
                                });
    }

    this.getDb = function(app, callback) {
        if (!_db) {
            this.connect(app, function(err) {
                if (err) {
                    console.log('Failed to connect to database server');
                } else {
                    console.log('Connected to database server successfully');
                }

                callback(err, _db);
            });
        } else {
            callback(null, _db);
        }

    }
}

module.exports = exports = new Database(); // Singleton
