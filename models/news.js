var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
  type:  {type:Schema.Types.ObjectId, index:true, ref: 'NewsType'},
  title: {type:String, index:true},
  link:   String,
  content: String,
  coverImg: String,
  desc: String,
  key: String,
  outLink: String,
  isPublished: {type: String , enum: ['ready', 'published', 'nopublish'], default: 'nopublish'},
  createDate : { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now }
});


//control columns that should be displayed by different operations
newsSchema.listColumns = ['_id', 'type', 'title', 'link', 'coverImg', 'desc', 'key', 'outLink', 'isPublished',
                           'createDate', 'updateDate']
newsSchema.selectColumns = ['_id', 'type', 'title', 'link', 'content', 'coverImg', 'desc', 'key', 'outLink', 'isPublished',
                           'createDate', 'updateDate']
 
//module.exports = mongoose.model('Dept', deptSchema);
module.exports = newsSchema
