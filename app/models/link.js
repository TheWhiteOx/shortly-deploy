var db = require('../config');
var crypto = require('crypto');
var Mongoose = require('mongoose');


var LinkSchema = new Mongoose.Schema({
  createdOn: { type: Date, default: Date.now},
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

LinkSchema.pre('save', function(next){
  console.log('creating link');
  var link = this;
  console.log('creating shasum');
  var shasum = crypto.createHash('sha1');
  console.log('updating shasum');
  shasum.update(link.url)
  console.log('setting code...')
  this.code = shasum.digest('hex').slice(0,5);
  console.log('done!')
  next();
});

/*var Link = db.Model.extend({
  tableName: 'urls',
  hasTimestamps: true,
  defaults: {
    visits: 0
  },
  initialize: function(){
    this.on('creating', function(model, attrs, options){
      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      model.set('code', shasum.digest('hex').slice(0, 5));
    });
  }
});*/

module.exports = Mongoose.model('urls', LinkSchema);
