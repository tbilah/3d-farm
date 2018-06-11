const mongoose = require('mongoose');
const config = require('../../config.json');

const staffSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: String,
    type: {
        type: String,
        enum: config.staff,
        default: config.staff[0],
        required: true
    },
    departement: {
        type: String,
        required: true
    }
});

/**
{
    "name": "Abdelilah KHLIL",
    "email": "khlil.abdelilah@gmail.com",
    "phone": "0782823308",
    "type": "CHEF",
    "departement": "toy departement"
}
 */

module.exports = mongoose.model('Staff', staffSchema);