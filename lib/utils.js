var fs =  require('fs')
var mongoose = require('mongoose');
var path = require('path')
var slug = require('slug')
var each = require('lodash/each')


//this function is to sluggify string which could probably be Camel style
function sluggify(filename){
    var index = 0
    var splittedFilename = "" 
    var index  = filename.search(/[A-Z]/)

    while(index != -1){
        splittedFilename += filename.slice(0,index) + ' ' + filename[index]
        filename = filename.slice(index + 1)
        index = filename.search(/[A-Z]/)
      }
    splittedFilename += filename
    return   slug(splittedFilename, {lower:true})
}

function __import(foldName){
      var models = {}
      var files = fs.readdirSync(foldName)
      each(files, (filename) => {
              models[sluggify(filename.split('.')[0])] = require(foldName + path.sep + filename)
           })
      console.log(models)
     return models
}

function modelizeSchema(schemas, router){
      var models = {}
      each(schemas, (obj, name) =>{
           obj.statics.findByKeyword = function (keyword, kv, cb){
              var cond = {}
              cond[keyword] = new RegExp(kv, 'i')
              if(obj.selectColumns) return this.find(cond, obj.selectColumns.join(' '), cb)
              else return this.find(cond, cb)
           }

           obj.statics.selectById = function (_id, cb){
              if(obj.selectColumns) return this.findById(_id, obj.selectColumns.join(' '), cb)
              else return this.findById(_id, cb)
           }
           obj.statics.delete = function (_id, cb){
             return this.findByIdAndRemove(_id,cb)
           }

           obj.statics.list = function (cb){
             if(obj.listColumns) return this.find({}, obj.listColumns.join(' '), cb)
             else return this.find({}, cb)
           }

           obj.statics.updateById = function (_id, obj, cb){
             obj.updateDate = new Date()
             return this.update({_id:_id}, obj, cb)
           }
          models[name] = mongoose.model(name.slice(0,1).toUpperCase() + name.slice(1), obj);
      })
      return models
}

exports.__import = __import
exports.modelizeSchema = modelizeSchema
