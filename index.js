const express = require('express')
const bodyParser =  require("body-parser")
const fs = require("fs");
const res = require('express/lib/response');
const app = express()

//ativovani ejs jako sablonovaciho systemus
app.set('view engine','ejs');


app.use(bodyParser.urlencoded({extended:true}));

//nastaveni slozky se statickymi soubory(prilohz -jpg,css)
app.use(express.static('public'));

app.get("/", function (req, res) {
    res.render('index');
  });

app.get("/about", function (req, res) {
  res.render('about');
});

app.get("/joke", function (req, res) {
    res.send('Víte co dělá windows na měsíci ? Padá 6 krát pomalejc.');
  });


app.post("/submit",function(req,res){
  console.log(req.body)
  let message = {
    author: req.body.author,
    message: req.body.message,
    timestamp:new Date().toISOString(),
    ip: req.ip.split(":").pop()
  }
  fs.readFile("messages.json",(err,data)=>{
    if(err)throw(err);
    let messages = JSON.parse(data);
    messages.push(message);
    fs.writeFile('messages.json', JSON.stringify(messages), function (err) {
      if (err) throw err;
        res.send("<h1>Vase odpověd byla zaznamenana</h1>")
    });
  })
  
})

app.get("/messages/json",(req, res) => {
  fs.readFile("messages.json",(err,data)=>{
    if(err) {
      res.send("Udelals kritickou chybu - soubor nebyl nacten")
    }
    if (data){
      res.json(JSON.parse(data));
    }
  });
});

app.get("/messages",(req, res) => {
  fs.readFile("messages.json",(err,data)=>{
    let messages = JSON.parse(data);
    if(queryAuthor){
      messages = messages.filter(message => message.author === queryAuthor);
    }
    if(dateQuery){
      messages = messages.filter(message =>{
        const messageDate = new Date(message.timestamp).toISOString()
          .split("T")[0];
        return messageDate === dateQuery;
      })
    }
    if(err) {
      res.send("Udelals kritickou chybu - soubor nebyl nacten");
    }
    if (data){
      const messages = JSON.parse(data);
      res.render("messages",{zpravy: messages});
    }
  });
});

app.listen(3000);