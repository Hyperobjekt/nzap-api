let now = new Date();

let amenities = [
    { icon: '', label: 'Dish Washer' },
    { icon: '', label: 'Washer' },
    { icon: '', label: 'Dryer' },
    { icon: '', label: 'Doorman' }
].map(e => {
    e.tags = ['stock'];
    e.created = now;
    return e;
})

db.amenities.insertMany(amenities)