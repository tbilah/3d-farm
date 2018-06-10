const mongoose = require('mongoose');

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
    "type": "chef",
    "departement": "toy departement"
}
 */

module.exports = mongoose.model('Staff', staffSchema);