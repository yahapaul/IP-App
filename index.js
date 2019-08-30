const dialog = require('dialog');
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const path = require('path');
var check = false;
var os = require("os");

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine' ,'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));	
var accepted =[];
var rejected =[];


const knex  =  require ('knex')({
  client :  'mysql' ,
  connection : {
    host :  '127.0.0.1' ,
    user :  'root' ,
    password :  '05958mn0' ,
    database :  'task'
  }
});
app.post('/addIP',async(req,res) =>{
	try{	
		var newIP = req.body.newIP;
		var inputs = newIP.split(os.EOL);
		console.log(inputs);
        let IPadd =  await knex('IP').select('IPadd');

        for (var x = 0; x < inputs.length; x++){
        	inputs[0] = inputs[0].replace(/\r?\n|\r/g, "")
        	for (var i = 0; i < IPadd.length; i++) {
	        	if(IPadd[i].IPadd == inputs[x]){
	        		check = true;
        		}
        	}
        	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(inputs[x])){
			 	if(check == false){
				 	id = await knex('IP').insert({
						'IPadd': inputs[x]
					});
					accepted.push(inputs[x]);
					res.redirect('/');
				}
				else{
					rejected(inputs[x]);
			  		res.redirect('/');
				}
			}
			else{
				rejected.push(inputs[x]);
			 	res.redirect('/');

			}
	  		check = false;	
        }
	}catch(e){
		console.log(e);
		next(e)
	}
});

app.post('/removeIP',async(req,res) =>{
	try{	    
		var removeIP = req.body.check;
		if (typeof removeIP === 'string') {
			await knex('IP').where({'IPadd':removeIP}).del();     
    	} 

    	else if (typeof removeIP === 'object') {
        	for (var i = 0; i < removeIP.length; i++) {
				await knex('IP'). where('IPadd' ,removeIP[i]).del();  
				
        	}
    	}
		res.redirect('/');

	}catch(e){
		console.log(e);
		next(e)
	}
  
});


app.get('/',async(req,res) =>{
	try {
		var task =[];
		var complete = [];
        let IPadd =  await knex('IP').select('IPadd');
       	for (var i = 0; i < IPadd.length; i++) {
        	if(IPadd[i].IPadd != null){
        		task.push(IPadd[i].IPadd);	
        	}
        	
        };
        
        res.render("index", { task: task, accepted: accepted, rejected :rejected});
    } catch (e) {
        console.log(e);
    }
	 
});

app.listen(port,(err) =>{
	if(err){
		console.log(err);
	}
	console.log(`listening to port ${port}`);
});