var express = require('express');
var app = express();
var url = require('url');
//const path = require('path')
app.set('port', (process.env.PORT || 8888));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/mail', function(req, res) {
	var weight = req.query.weight;
	var mailType = req.query.mailType;

	console.log(weight);
	console.log(mailType);

	var rate = computeResults(req, res); 
	console.log(rate);

	var params = {lbs: weight, mailType: mailType, rate: rate};
	

	res.render('pages/results', params);
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port')); 
});

function computeResults(req, res) {

	var centsIncrement = .21;
	var weight = req.query.weight;
	var mailType = req.query.mailType;

	switch(mailType) 
	{
		case "Letters (Stamped)":
			cost = rateOfLetter(weight, centsIncrement, true, .5);
			if (cost != -1) {
				cost = cost.toFixed(2);
			}
			else {
				cost = 0;
			}
			return cost;
			//return rateOfLetter(weight, centsIncrement, true, .5);
			break;
		case "Letters (Metered)":
			cost = rateOfLetter(weight, centsIncrement, false, .47); 
			if (cost != -1) {
				cost = cost.toFixed(2);
			}
			else {
				cost = 0;
			}
			return cost;
			break;
		case "Large Envelopes (Flats)":
			cost = largeEnvRate(weight, centsIncrement);
			if (cost != -1) {
				cost = cost.toFixed(2);
			}
			else {
				cost = 0;
			}
			return cost;
			break;
		case "First-Class Package Service - Retail":
			return retailPrice(weight);
			break;
		default:
			return -1;
	}

	

}
	
function rateOfLetter(weight, centsIncrement, isStamped, startingBase) {
	if (weight <= 3) {
		weight = weight - 1;
		var cost = (centsIncrement * weight) + startingBase;
		return cost;
	}
	else if (weight > 3 && weight <= 4 && isStamped) {
		return 1.13;
	}
	else if (weight > 3 && weight <= 4 && !isStamped) {
		return 1.10;
	}
	else {
		return -1;
	}

}

function largeEnvRate(weight, centsIncrement) {
	if (weight <= 13) {
		weight = weight -1;
		var cost = (centsIncrement * weight) + 1;
		return cost;
	}
	else {
		return -1;
	}
}

function retailPrice(weight) {

	console.log(typeof weight);

	switch (weight) {
		case "1":
		case "2":
		case "3":
		case "4":
			return 3.50;
		case "5":
		case "6":
		case "7":
		case "8":
			return 3.75;
		case "9":
			return 4.10;
		case "10":
			return 4.45;
		case "11":
			return 4.8;
		case "12": 
			return 5.15;
		case "13":
			return 5.50;
		default:
			return -1;
	}
}
