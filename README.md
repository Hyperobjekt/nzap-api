# nzap-api

## Running Locally

In the root of the project set up environment variables.

Do:

``` bash
echo "API_VERSION=v1\nPORT=5000\nMONGO_URL=$mongoDB\nTZ=America/New_York\nJWT_SECRET=" > .env
```

⚠️ Replace `$mongoDB` with `mongodb+srv://$username:$password@nzap-v1.swvyf.mongodb.net/nzap?retryWrites=true&w=majority`

⚠️ Replace `$username` & `$password` with the appropriate values

In the root of the project; do:

``` bash
mongoDB="mongodb://localhost:27017/nzap?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
echo "MODE=DEVELOPMENT \nTZ=\"America/New_York\" \nAPI_VERSION=v1 \nMONGO_URL=\"$mongoDB\" \nnodemon server" > start
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
