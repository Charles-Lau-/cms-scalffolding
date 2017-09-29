var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deptSchema = new Schema({
  name:  {type:String, index:true},
  phone: String,
  tele:   String,
  desc: String,
  createDate : { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now }
});


//control columns that should be displayed by different operations
deptSchema.listColumns = ['_id', 'name', 'phone', 'tele', 'desc', 'createDate', 'updateDate']
deptSchema.selectColumns = ['_id', 'name', 'phone', 'tele', 'desc', 'createDate', 'updateDate']
//module.exports = mongoose.model('Dept', deptSchema);
module.exports = deptSchema
