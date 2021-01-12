module.exports = {
    permissions: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    collection: 'demos',
    schema: {
        _id: { type: 'id', required: false },
        demo_ids: { type: 'array_of_ids', schema: 'demos', required: false },
        arrayOfStrings: { type: 'array_of_strings', required: true },
        boolean: { type: 'boolean', default: true, required: false },
        color: { type: 'color', required: false },
        date: { type: 'date', required: false },
        email: { type: 'email', required: true },
        match: { type: 'match', matches: ['MATCHONE', 'MATCHTWO'], required: true },
        number: { type: 'number', required: false },
        password: { type: 'password', required: true },
        phone: { type: 'phone', required: false },
        slug: { type: 'slug', required: true },
        string: { type: 'string', required: true },
        title: { type: 'title', required: false },
        url: { type: 'url', required: true },
        created: { type: 'date', required: false },
    }
};