var fs =  require('fs')
var mongoose = require('mongoose');
var path = require('path')
var each = require('lodash/each')

function __import(foldName){
      var models = {}
      var files = fs.readdirSync(foldName)
      each(files, (filename) => {
              models[filename.split('.')[0]] = require(foldName + path.sep + filename)
           })
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
             console.log(obj)
             console.log(_id)
             return this.update({_id:_id}, obj, cb)
           }
          models[name] = mongoose.model(name.slice(0,1).toUpperCase() + name.slice(1), obj);
      })
      return models
}

exports.__import = __import
exports.modelizeSchema = modelizeSchema
