# nzap-api

## Uploading a Databall.

First download the new databall (CSV) to the `/_data/` folder and rename it `nzap_data.csv`

### Set up the scripts

⚠️ Only necessary if there aren't any files in `_scripts/` called `_clean` **and** `_prefill`

``` bash
# Navigate to the scripts folder
cd _scripts

# Replace $username & $BoPXBsxWFyKawXDo
echo "mongo mongodb+srv://nzap-v1.swvyf.mongodb.net/nzap --username $username --password $password ./_scripts/clean.db.js" > _clean
echo "mongo mongodb+srv://nzap-v1.swvyf.mongodb.net/nzap --username $username --password $password ./_scripts/prefill.db.js" > _prefill

# Make the files executable
chmod +x _clean
chmod +x _prefill
```

### Run

 `npm run data:mk_json`

 > This might take a while - go get a cup of ☕
