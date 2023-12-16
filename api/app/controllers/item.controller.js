const db = require("../models");
const Item = db.item;
var mongoose = require("mongoose");

exports.add = async (req, res) => {
    try {
        let newItem = new Item(req.body);
        let itemData = await newItem.save();

        return res.status(200).send({
            itemData: itemData,
            message: "Item added"
        });
    } catch (err) {
        console.log('Error while adding item:', err);

        return res.status(500).send({
            message: "Error while adding item"
        });
    }
}

exports.view = async (req, res) => {
    try {
        console.log(req.params.id)
        let itemData = await Item.findById(mongoose.Types.ObjectId(req.params.id));

        if (itemData) {
            return res.status(200).send({ itemData });
        } else {
            return res.status(404).send({
                message: "No data found"
            });
        }
    } catch (err) {
        console.log('Error while fetching item:', err);

        return res.status(500).send({
            message: "Error while fetching item"
        });
    }
}

exports.update = async (req, res) => {
    try {
        let itemData = await Item.findByIdAndUpdate(
            { _id: req.params.id },
            req.body,
        );

        if (!itemData) {
            return res.status(404).send({
                message: "No item found"
            });
        } else {
            return res.status(200).send({
                message: "Updated"
            });
        }
    } catch (err) {
        console.log('Error while updating item:', err);

        return res.status(500).send({
            message: "Error while updating item"
        });
    }
}

exports.delete = async (req, res) => {
    try {
        await Item.deleteOne({ _id: req.params.id });

        return res.status(200).send({
            message: "Deleted"
        });
    } catch (err) {
        console.log('Error while deleting item:', err);

        return res.status(500).send({
            message: "Error while deleting item"
        });
    }
}

exports.list = async (req, res) => {
    try {
        let { startDate, endDate } = req.body;

        let conditions = {};

        if (startDate && endDate) {
            conditions = { createdAt: { $gte: startDate, $lte: endDate } };
        }

        let itemList = await Item.find(conditions);

        console.log('list', itemList);
        return res.status(200).send(itemList);
    } catch (err) {
        console.log('Error while fetching item list:', err);

        return res.status(500).send({
            message: "Error while fetching item list"
        });
    }
}