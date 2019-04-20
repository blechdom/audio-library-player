var mongoose = require('mongoose');
const mongoURL = "mongodb://localhost:27017/audioDB";

const mongoOptions = {
  useNewUrlParser: true,
  reconnectTries: 60,
  reconnectInterval: 1000
}

mongoose.connect(mongoURL, mongoOptions);
