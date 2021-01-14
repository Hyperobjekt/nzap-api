var account_ids = db.accounts.find({ tags: 'TEST' }).toArray().map(result => result._id)
db.api_keys.deleteMany({ "account_id": { "$in": account_ids } })
db.accounts.deleteMany({ tags: 'TEST' })
db.users.deleteMany({ tags: 'TEST' });
db.addresses.deleteMany({ tags: 'TEST' });
db.buildings.deleteMany({ tags: 'TEST' });
db.apartments.deleteMany({ tags: 'TEST' });
db.rooms.deleteMany({ tags: 'TEST' });