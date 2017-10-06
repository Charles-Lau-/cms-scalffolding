"use strict"

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
      var schemas = {}
      var files = fs.readdirSync(foldName)
      each(files, (filename) => {
              schemas[filename.split('.')[0]] = require(foldName + path.sep + filename)
           })
     return schemas
}

function modelizeSchema(schemas, router){
      var models = {}
      each(schemas, (obj, name) =>{
           //for the part of populating reference keys
           var refKeys = getRefereceKey(obj)
           obj.statics.findByKeyword = function (keyword, kv, cb){
              var query = null
              var cond = {}
              cond[keyword] = new RegExp(kv, 'i')
              if(obj.selectColumns) query = this.find(cond, obj.selectColumns.join(' '))
              else query = this.find(cond)

              if(refKeys.length == 0) return query.exec(cb)
              else{
                each(refKeys, (refk, index) => {
                    if(index == refKeys.length - 1)
                        return query.populate(refk).exec(cb)
                    else
                        query = query.populate(refk)
                })
              }
           }

           obj.statics.selectById = function (_id, cb){
              var query = null
              if(obj.selectColumns) query = this.findById(_id, obj.selectColumns.join(' '))
              else query = this.findById(_id)

              if(refKeys.length == 0) return query.exec(cb)
              else{
                each(refKeys, (refk, index) => {
                    if(index == refKeys.length - 1)
                        return query.populate(refk).exec(cb)
                    else
                        query = query.populate(refk)
                })
              }
           }
           obj.statics.delete = function (_id, cb){
             return this.findByIdAndRemove(_id,cb)
           }

           obj.statics.list = function (cb){
             var query = null
             if(obj.listColumns) query = this.find({}, obj.listColumns.join(' '))
             else query = this.find({})


             if(refKeys.length == 0) return query.exec(cb)
             else{
               each(refKeys, (refk, index) => {
                   if(index == refKeys.length - 1)
                       return query.populate(refk).exec(cb)
                   else
                       query = query.populate(refk)
               })
             }
           }

           obj.statics.updateById = function (_id, obj, cb){
             obj.updateDate = new Date()
             return this.update({_id:_id}, obj, cb)
          }

          models[sluggify(name)] = mongoose.model(name.slice(0,1).toUpperCase() + name.slice(1), obj);
      })
      return models
}


function getRefereceKey(schema){
  var refKeys = []
  each(Object.keys(schema.paths), (key) => {
    if(schema.path(key).options.ref != undefined)
        refKeys.push(key)
  })
  return refKeys
}

exports.__import = __import
exports.modelizeSchema = modelizeSchema
