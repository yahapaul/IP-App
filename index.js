const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const path = require('path');

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine' ,'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));



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
		let id = await knex('IP').insert({
			'IPadd': newIP
		});
		res.redirect('/');

	}catch(e){
		console.log(e);
		next(e)
	}
});

app.post('/removeIP',async(req,res) =>{
	try{	    
		var removeIP = req.body.check;
		if (typeof completeTask === 'string') {
			await knex('IP').where( {'IPadd':removeIP}).del();     
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
        
        res.render("index", { task: task});
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