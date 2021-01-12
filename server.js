const db = require('./db');
const PORT = process.env.PORT || 3002;
const API_VERSION = process.env.API_VERSION;

let server;
let dbClient;

(async () => {
    try {
        dbClient = await db();
        const app = require('./app')();
        app.set('db', dbClient);
        server = app.listen(PORT, () => {
            console.log(`☑ http://localhost:${PORT}/api/${API_VERSION}/ \n\n`);
        });
    } catch (err) {
        console.error(err.stack || err);
    };
})();

// nzapSite:BoPXBsxWFyKawXDo

// mongodb+srv://nzapSite:BoPXBsxWFyKawXDo@nzap-v1.swvyf.mongodb.net/nzap?authSource=admin&replicaSet=atlas-10vn5x-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=false&ssl=true