var express = require('express');
var path = require('path');
var utils = require('../lib/utils');
var schemas =  utils.__import(path.resolve('./models'));
var router = express.Router();


//register basic crud method for models
var models = utils.modelizeSchema(schemas, router)

/* GET home page. */
router.get('/', function (req, res){
     res.end('home page is being accessed')
})

//crud method
router.get('/:name', function (req, res){
      var name = req.params.name
      models[name].list(function (err, data){
          if(err) res.end(err)
          else res.end(JSON.stringify(data))
      })
})

router.get('/:name/:id', function(req, res) {
      var name = req.params.name
      var id = req.params.id
      models[name].selectById(id, function (err, data){
        if(err) res.end(err)
        else res.end(JSON.stringify(data))
      })
});

router.get('/:name/:keyword/:kv', function (req, res){
     var name = req.params.name
     var keyword = req.params.keyword
     var kv = req.params.kv
     models[name].findByKeyword(keyword, kv, function (err, data){
        if(err) res.end(err)
        else res.send(JSON.stringify(data))
     })
})

//post method
router.post('/:name', function (req, res){
     var name = req.params.name
     var Model =  models[name]
     new Model(req.body).save(function (err, data){
       if(err) res.end(err)
       else res.end('succesfully added')
     })
})

//delete method
router.delete('/:name/:id', function (req, res){
     var name = req.params.name
     var id = req.params.id
     models[name].delete(id, function (err, data){
       if(err) res.end(err)
       else  res.end('deleted succesfully')
     })
})

//update method
router.put('/:name/:id', function (req, res){
    var name = req.params.name
    var id = req.params.id
    models[name].updateById(id, req.body, function (err, data){
      if(err) res.end(err)
      else res.end('updated succesfully')
    })
})

module.exports = router;
