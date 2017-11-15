var client = require('http-api-client');
var sqlite3 = require("sqlite3").verbose();


// Open a database handle
var db = new sqlite3.Database("data.sqlite");
var p=0; var p2=0;

//db.run("DELETE FROM data");

var currentCount =  "2017-01-03T15:35:59.091342+03:00"

//db.each("SELECT dateModified FROM data ORDER BY dateModified DESC LIMIT 1", function(err, timeStart) {
      
	//var currentCount = timeStart.dateModified
	console.log("старт: "+currentCount); 
	//var end  = formatTime(new Date());
	//console.log("конец: "+end);

//db.run("DELETE FROM data");
	
function piv(){  
p++;
client.request({url: 'https://public.api.openprocurement.org/api/2.3/plans?offset='+currentCount})
		.then(function (data) {
						 
		
			var dataset = data.getJSON().data;
			
			currentCount = data.getJSON().next_page.offset;			
			console.log(currentCount)
			
			return dataset;
	
		})	
		.then(function (dataset) {	
		
			dataset.forEach(function(item) {
				client.request({url: 'https://public.api.openprocurement.org/api/0/plans/'+item.id})
					.then(function (data) {
			


if(data.getJSON().data.budget.year =="2017"){
	
db.serialize(function() {
	db.run("CREATE TABLE IF NOT EXISTS data (dateModified TEXT,name TEXT,id TEXT,amount INT,procurementMethod TEXT,procurementMethodType TEXT,cpv TEXT,startDate TEXT,additionalClassifications TEXT, notes TEXT,description TEXT)");
	var statement = db.prepare("INSERT INTO data VALUES (?,?,?,?,?,?,?,?,?,?,?)");
	var name = data.getJSON().data.procuringEntity.name.toLowerCase();
	statement.run(
		item.dateModified,
		name,
		data.getJSON().data.procuringEntity.identifier.id,
		data.getJSON().data.budget.amount,
		data.getJSON().data.tender.procurementMethod,
		data.getJSON().data.tender.procurementMethodType,
		data.getJSON().data.classification.id,
		data.getJSON().data.tender.tenderPeriod.startDate,
		data.getJSON().data.additionalClassifications[0].id,
		data.getJSON().data.budget.notes,
		data.getJSON().data.budget.description
		
		
	);
	statement.finalize();
});

}//year
				
				})
					.catch(function  (error) {
						console.log("error_detale")
						
					});  
				});
		
		})
		.then(function () {	
		if (p<3){piv ();}		
		else {
			console.log("stop")
				p=0;
				p2++;
				console.log(p2)
			setTimeout(function() {
			
				if (p2 < 3) {
					piv ();
				}
				else {
					console.log("STOP");
				     }
				}, 5000);
		}		 
							
		}) 
		.catch( function (error) {
		console.log("error")
		piv ();
		});   
		
		
			 

}

piv ();	
 
//});
