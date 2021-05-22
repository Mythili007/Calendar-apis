const {MongoClient} = require('mongodb');

module.exports.main = async function(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = process.env.DB_CONNECTION;
 

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
    try {
        // Connect to the MongoDB cluster
        const clientConnection = await client.connect();
        console.log("file: dbclient.js ~ line 16 ~ module.exports.main=function ~ clientConnection", clientConnection)
 
        // Make the appropriate DB calls
        // await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

// main().catch(console.error);
