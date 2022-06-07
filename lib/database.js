'use strict';

var MongoClient = require('mongodb').MongoClient;
var serviceBindings = require('kube-service-bindings');
var config = require('./config');
var { Pool } = require("pg");
var _db;

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

var bindings;
try {
    // check if the deployment has been bound to a pg instance through
    // service bindings. If so use that connect info
    bindings = serviceBindings.getBinding('POSTGRESQL', 'pg');
    console.log('check bindings');
    console.log(bindings);
    console.log('verifying if cert can be read from the binding object:');
    console.log(bindings["root.crt"]);
} catch (err) { // proper error handling here
    console.log('bindings failed');
};


const pool = new Pool({
    user: bindings.user,
    password: bindings.password,
    host: bindings.host,
    database: bindings.database,
    port: bindings.port,
    sslmode: bindings.sslmode,
    options: bindings.options,
    ssl: {
        rejectUnauthorized: false,
        ca: bindings["root.crt"].toString()
    }
})

//checking connection with pg driver to cockroachdb
/*pool
  .connect()
  .then(client => {
    console.log('connected to cockroachdb')
    client.release()
  })
  .catch(err => console.error('error connecting', err.stack))
  .then(() => pool.end())*/

/*
var delete_table = "DROP TABLE higscores CASCADE";
pool.query(delete_table, function(err, rows){
        if(err){
            console.error(err);
            return;
        }else{
            console.log(rows);
            return;
        }
    });
*/


var create_table = "CREATE TABLE IF NOT EXISTS highscores ( name STRING NOT NULL, cloud STRING NOT NULL, zone STRING NOT NULL, host STRING NOT NULL, score INT NOT NULL, level INT NOT NULL, date DATE NOT NULL, referer STRING NOT NULL, user_agent STRING NOT NULL, hostname STRING NOT NULL, ip_addr STRING NOT NULL)";
pool.query(create_table, function(err, rows){
        if(err){
            console.error(err);
            return;
        }else{
            console.log(rows);
            return;
        }
    });


function Database() {
    this.connect = function(app, callback) {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
    _db = pool;
    app.locals.db = pool;
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
