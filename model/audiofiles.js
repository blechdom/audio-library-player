var mongoose = require('mongoose');
var audiofileSchema = new mongoose.Schema({
  title: String,
  artist: String,
  duration: String,
  codec: String
});
mongoose.model('Audiofile', audiofileSchema);
