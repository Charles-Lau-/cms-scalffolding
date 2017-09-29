var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsTypeSchema = new Schema({
  name:  {type:String, index:true},
  createDate : { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now }
});


//control columns that should be displayed by different operations
newsTypeSchema.listColumns = ['_id', 'name', 'createDate', 'updateDate']
newsTypeSchema.selectColumns = ['_id', 'name', 'createDate', 'updateDate']
//module.exports = mongoose.model('Dept', deptSchema);
module.exports = newsTypeSchema
