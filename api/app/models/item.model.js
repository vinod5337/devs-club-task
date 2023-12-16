const mongoose = require("mongoose");

const Item = mongoose.model(
    "Item",
    new mongoose.Schema({
        name: String,
        price: Number,
        quantity: Number
    },
        { timestamps: true }
    ),
    "items"
);

module.exports = Item;
