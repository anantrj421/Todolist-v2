//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
const showi = [];
mongoose.connect('mongodb+srv://anantrj:superman123@cluster0-pvibk.mongodb.net/todo', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
const itemsh = new mongoose.Schema({
  name: String
});
const listsh = new mongoose.Schema({
  name: String,
  items:[itemsh] 
});
const List = mongoose.model("list",listsh);
const item = mongoose.model("Items",itemsh);
const item1 = new item({
  name: "This is your to do list"
});
const item2 = new item({
  name: "Add work to be done"
});
const item3 = new item({
  name: "Remove work when done"
});
const defi = [item1, item2, item3];

app.get("/", function(req, res){
  item.find({},function(err,items){
    if(items.length===0){
      item.insertMany(defi, function(err){
        if (err)
          console.log(err);
        else
          console.log("Successfully entered data");
      });
    }
      res.render("list",{day:"Today", newi:items});
  });
});
app.get("/:customListName",function(req,res){
  const custn = _.capitalize(req.params.customListName);
  List.findOne({name: custn},function(err,foundlist){
    if(!err){
      if(!foundlist){
        const list = new List({
          name: custn,
          items: defi
        });
        list.save();
        res.redirect("/"+custn);
      }
      else{
        res.render("list",{day:foundlist.name, newi:foundlist.items});
      }
    }
  });
  
});
app.post("/",function(req,res){
    const i1=req.body.t1;
    const l1=req.body.btn;
    const newit = new item({
      name: i1
    });
    if(l1==="Today"){
      newit.save();
      res.redirect("/");
    }
    else{
      List.findOne({name: l1},function(err,foundlist){
        foundlist.items.push(newit);
        foundlist.save();
        res.redirect("/"+l1);
      });
    } 
});
app.post("/delete",function(req,res){
    const deli = req.body.cb;
    const listname = req.body.lname;
    if(listname==="Today"){
      item.deleteOne({_id:deli},function(err){
        if(!err){
          console.log("Successfully removed");
          res.redirect("/");
        }
      });
    }
    else{
      List.findOneAndUpdate({name:listname},{$pull:{items:{_id:deli}}},function(err,foundlist){
        if(!err){
          res.redirect("/"+listname);
        }
      });
    }
});
let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port, function(){
  console.log("Server started on port.");
});
