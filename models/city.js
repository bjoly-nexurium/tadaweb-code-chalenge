var mongoose = require('mongoose')
        , Schema = mongoose.Schema
        , SchemaTypes = Schema.Types
        , ObjectId = Schema.ObjectId;


var CitySchema = new Schema({
    id: {type: String, unique: true},
    name: String,
    ascii: String,
    //alt_name:[name:String],
    alt_name: String,
    lat:String,
    long: String,
    feat_class: String,
    feat_code: String,
    country: String,
    cc2: String,
    admin1: Number,
    admin2: Number,
    admin3: Number,
    admin4: Number,
    population: Number,
    elevation: Number,
    dem: Number,
    tz: String,
    modified_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('cities', CitySchema);
