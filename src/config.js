
const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
    .catch(() => {
        console.log("Database cannot be Connected");
    })

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const collection = new mongoose.model("users", Loginschema);


const timeRecordSchema = new mongoose.Schema({
    type: String, // "stopwatch" atau "countdown"
    startTime: Date,
    endTime: Date,
    duration: Number // dalam milidetik
  });
  
  const TimeRecord = mongoose.model("TimeRecord", timeRecordSchema);

module.exports = {collection, TimeRecord};
