# nzap-api

## Running Locally

Create a `.env` file in the root of the project with the following config

``` bash
echo "API_VERSION=v1\n
PORT=5000\n
MONGO_URL=$mongoDB\n
TZ=America/New_York\n
JWT_SECRET=" > .env
```

Replace `$mongoDB` with `mongodb+srv://$username:$password@nzap-v1.swvyf.mongodb.net/nzap?retryWrites=true&w=majority`

> Replace `$username` & `$password` with the appropriate values

In the root of the project; do:

``` bash
echo "MODE=DEVELOPMENT \n
TZ=\"America/New_York\" \n
API_VERSION=v1 \n
MONGO_URL=\"mongodb://localhost:27017/nzap?readPreference=primary&appname=MongoDB%20Compass&ssl=false\" \n
nodemon server" > start
```

Make executable

``` bash
$ chmod -x start
```

Run
```$bash
npm run dev

``` 

---

## Uploading a Databall.

First download the new databall (CSV) to the `/_data/` folder and rename it `nzap_data.csv`

### Set up the scripts

⚠️ Only necessary if there aren't any files in `_scripts/` called `_clean` **and** `_prefill`

Navigate to the scripts folder
``` bash
cd _scripts
```

Replace `$username` & `$password`

``` bash
echo "mongo mongodb+srv://nzap-v1.swvyf.mongodb.net/nzap --username $username --password $password ./_scripts/clean.db.js" > _clean
```

``` bash
echo "mongo mongodb+srv://nzap-v1.swvyf.mongodb.net/nzap --username $username --password $password ./_scripts/prefill.db.js" > _prefill
```

Make the files executable

``` bash
chmod +x _clean
```

``` bash
chmod +x _prefill
```

### Run

 

``` bash
 npm run data:mk_json
 ```

 > This might take a while - go get a cup of ☕
