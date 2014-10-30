// routes/enquete.js
var enquete = require('../data/enquetes.json');

module.exports = {
  // findAll
  findAll: function(req, res){
    res.send(enquete.enquetes);
  }
};
