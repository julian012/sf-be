const pg = require('pg');

const client = new pg.Client({
 user: 'ijxwighlatevgr',
    host: 'ec2-52-204-20-42.compute-1.amazonaws.com',
    database: 'dbrgmlpm3b8gne',
    password: 'ec8a817d8f0421d3820655dc329790406ab4e9f54de0d70948fd99251c26c634',
    port: 5432,
    ssl: true
});
client.connect();

module.exports = client;