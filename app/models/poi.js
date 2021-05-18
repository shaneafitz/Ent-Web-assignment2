"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const poiSchema = new Schema({
  name: String,
  description: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  imageUrl: String,
});

module.exports = Mongoose.model("Poi", poiSchema);
