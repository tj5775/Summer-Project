const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const citySchema = new Schema({
  city: {
    type: String,
    unique: true,
    trim: true,
  },
  state: {
    type: String,
  },
  data: {
    type: Array,
    minlength: 2,
  },
});
const City = mongoose.model("City", citySchema);

module.exports = City;
