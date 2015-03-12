function initGeolocation()
 {
	if( navigator.geolocation ) {
		// Call getCurrentPosition with success and failure callbacks
		navigator.geolocation.getCurrentPosition( success, fail );
	}
	else {
		alert("Sorry, your browser does not support geolocation services.");
	}
 }

 function success(position)
 {
	getTransitTime(position.coords.latitude, position.coords.longitude);
 }

 function fail()
 {
	// Could not obtain location
 }


function getTransitTime(lat, lon) {
	window.destAddress='40.696319,-73.960623'

	var directionsService = new google.maps.DirectionsService();
     var request = {
       origin: '40.7551582,-73.9410288999999',
       destination: window.destAddress,
       travelMode: google.maps.DirectionsTravelMode.TRANSIT
     };
     directionsService.route(request, function(response, status) {
       if (status == google.maps.DirectionsStatus.OK) {
			console.log(response);
var arrival_time = response.routes[0].legs[0].arrival_time.value;
			window.transitHandData[0].value = arrival_time.getHours() % 12 + (arrival_time.getMinutes() / 60);
			window.transitHandData[1].value = arrival_time.getMinutes();
			window.transitHandData[2].value = arrival_time.getSeconds();
			console.log(window.transitHandData);
/*			$("#arrival_time").html(response.routes[0].legs[0].arrival_time.text);
			$("#arrival_time_detail").html(response.routes[0].legs[0].arrival_time.value);
			_.each(response.routes[0].legs[0].steps, function(d) {
				$("<div>").html(d.instructions).appendTo("#steps");
			}); */


			var transitHands = d3.select("#transit-hands");

			transitHands.selectAll('path')
				.data(window.transitHandData)
					.enter()
					.append('path')
					.attr('class', function(d){
						return d.type + '-transitHand transitHand';
					})
					.attr('d', function(d) {
						return "M" + (d.width / 2.0) + " " + d.balance + " L" + (d.width / -2.0) + " " + d.balance + " L0 " + d.length + " Z"
					})
					.attr('transform',function(d){
						return 'rotate(' + ((d.scale(d.value) + 30) % 360) + ')';
					});


       }
     });
}





var d3clockfunc = function(scope, elem, attrs) {


	window.onresize = function(event) {
		onWindowResize();
	}

	var onWindowResize = function() {
		var svg = elem.find("svg")[0];
		var targetDim = Math.min(window.innerWidth, window.innerHeight);
		svg.setAttribute('height', targetDim);
		svg.setAttribute('width', targetDim);
		svg.style.marginTop = targetDim / -2.0;
		console.log(svg);
	};

	var radians = 0.0174532925, 
		clockRadius = 200,
		margin = 50,
		width = (clockRadius+margin)*2,
		height = (clockRadius+margin)*2,
		hourHandLength = 2*clockRadius/4,
		hourHandWidth = 10,
		hourHandBalance = 20,
		minuteHandLength = clockRadius - 30 ,
		minuteHandWidth = 8,
		minuteHandBalance = 20,
		secondHandWidth = 4,
		secondHandLength = clockRadius,
		secondHandBalance = 30,
		secondTickStart = clockRadius;
		secondTickLength = -10,
		hourTickStart = clockRadius,
		hourTickLength = -18
		secondLabelRadius = clockRadius + 16;
		secondLabelYOffset = 5
		hourLabelRadius = clockRadius - 40
		hourLabelYOffset = 7;

		/*	
		hour = secselapsed (domain: 0~86399, range: 0~360)
		minute = secondselapsed / 7854.545 (domain: 0~10, range: 0~360)
		undeecsmall = milliseconds elapsed % 66156.2021 -- (domain: 0~66155, range: 0~360) 
	var hourScale = d3.scale.linear()
		.domain([0,(86340 - 1)]) // from 0 to numhours - 1
		.range([0,360 - (360 / 86340)]); // from 0 to 360 - (360 / numhours)

	var minuteScale = d3.scale.linear()
		.domain([0,(11-1)])
		.range([0,360 - (360 / 11)]);

	var secondScale = d3.scale.linear()
		.domain([0,(66156.2021 - 1)])
		.range([0,360 - (360 / 66156.2021)]);

	
		*/

	var hourScale = d3.scale.linear()
		.domain([0,12]) // from 0 to numhours - 1
		.range([0,360]); // from 0 to 360 - (360 / numhours)

	var minuteScale = d3.scale.linear()
		.domain([0,60])
		.range([0,360]);

	var secondScale = d3.scale.linear()
		.domain([0,60])
		.range([0,360])

	var handData = [
		{
			type:'hour',
			value:0,
			scale:hourScale,
			length:-hourHandLength,
			balance:hourHandBalance,
			width:hourHandWidth
		},
		{
			type:'minute',
			value:0,
			scale:minuteScale,
			length:-minuteHandLength,
			balance:minuteHandBalance,
			width:minuteHandWidth 
		},
		{
			type:'second',
			value:0,
			scale:secondScale,
			length:-secondHandLength,
			balance:secondHandBalance,
			width:secondHandWidth 
		}
	];

	window.transitHandData = [
		{
			type:'hour',
			value:0,
			scale:hourScale,
			length:-hourHandLength,
			balance:hourHandBalance,
			width:hourHandWidth
		},
		{
			type:'minute',
			value:0,
			scale:minuteScale,
			length:-minuteHandLength,
			balance:minuteHandBalance,
			width:minuteHandWidth
		},
		{
			type:'second',
			value:0,
			scale:secondScale,
			length:-secondHandLength,
			balance:secondHandBalance,
			width:secondHandWidth 
		}
	];

	function drawClock(){ //create all the clock elements

		updateData();	//draw them in the correct starting position
		var rawSvg = elem.find("svg")[0];
		var svg = d3.select(rawSvg)
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMidyMid");

		var face = svg.append('g')
			.attr('id','clock-face')
			.attr('transform','translate(' + (clockRadius + margin) + ',' + (clockRadius + margin) + ')');

		//add marks for seconds
		face.selectAll('.second-tick')
			.data(d3.range(0, 60)).enter()
				.append('line')
				.attr('class', 'second-tick')
				.attr('x1',0)
				.attr('x2',0)
				.attr('y1',secondTickStart)
				.attr('y2',secondTickStart + secondTickLength)
				.attr('transform',function(d){
					console.log("minutetick");
					return 'rotate(' + ((secondScale(d / 1.0)) % 360) + ')';
				});
		//and labels
		//
		//... and hours
		face.selectAll('.hour-tick')
			.data(d3.range(0,11)).enter()
				.append('line')
				.attr('class', 'hour-tick')
				.attr('x1',0)
				.attr('x2',0)
				.attr('y1',hourTickStart)
				.attr('y2',hourTickStart + hourTickLength)
				.attr('transform',function(d){
					return 'rotate(' + hourScale(d) + ')';
				});

		face.selectAll('.hour-label')
			.data(d3.range(0,12))
				.enter()
				.append('text')
				.attr('class', 'hour-label')
				.attr('text-anchor','middle')
				.attr('x',function(d){
					return hourLabelRadius*Math.sin(hourScale(d)*radians + Math.PI);
				})
				.attr('y',function(d){
					return -hourLabelRadius*Math.cos(hourScale(d)*radians + Math.PI) + hourLabelYOffset;
				})
				.text(function(d){
					return (d + 6) % 12 ;
				});



		face.append('g').attr('id','face-overlay')
			.append('circle').attr('class','hands-cover')
				.attr('x',0)
				.attr('y',0)
				.attr('r',clockRadius/50);

		var transitHands = d3.select("#clock-face").append('g').attr('id','transit-hands');
		var hands = face.append('g').attr('id','clock-hands');

		hands.selectAll('path')
			.data(handData)
				.enter()
				.append('path')
				.attr('class', function(d){
					return d.type + '-hand hand';
				})
				.attr('d', function(d) {
					return "M" + (d.width / 2.0) + " " + d.balance + " L" + (d.width / -2.0) + " " + d.balance + " L0 " + d.length + " Z"
				})
				.attr('transform',function(d){
					return 'rotate(' + ((d.scale(d.value)) % 360) + ')';
				});

	}

	function moveHands(){
		d3.select('#clock-hands').selectAll('path')
		.data(handData)
			.transition()
			.ease("linear")
			.attr('transform',function(d){
				return 'rotate(' + ((d.scale(d.value)) % 360) + ')';
			});
	}

	function updateData(){
		var t = new Date();
		var elapsedSeconds = (3600 * t.getHours()) + (60 * t.getMinutes()) + t.getSeconds();
		var elapsedMilliseconds = (elapsedSeconds * 1000) + t.getMilliseconds();

		/* 
		in one day, there are 11 undechours 
		there are 11 
		The hour hand should turn 360 degrees in a day; the minute hand should do 11 rotations of 360 degrees in a day. The second hand should do 1331 360 degree rotations in a day.
		
		24hour  =  secondselapsed  / 3600 -- secs in an hour (domain: 0~23, range: 0~360)
		min = secondselapsed % 3600  -- secs in an hour (domain: 0~3599, range: 0~360)
		sec = milliseconds elapsed % 60,000 -- millisecs in a minute (domain: 0~59999, range: 0~360)
		hour = secselapsed (domain: 0~86399, range: 0~360)
		minute = secondselapsed / 7854.545 (domain: 0~10, range: 0~360)
		second = milliseconds elapsed % 66156.2021 -- (domain: 0~66155, range: 0~360)

		handData[0].value = elapsedSeconds / 86400 * 11;
		handData[1].value = elapsedSeconds / 7854.5455;
		handData[2].value = elapsedMilliseconds % 66156.2021;
		*/

		handData[0].value = t.getHours() % 12;
		handData[1].value = t.getMinutes();
		handData[2].value = t.getSeconds();

		/*console.log(t.getHours());
		console.log(t.getMinutes());
		console.log(t.getSeconds()); */

/*		console.log(elapsedSeconds / 86400.0 * 11.0);
		console.log(elapsedSeconds % 7854.5455);
		console.log( Math.round(elapsedMilliseconds % 66156.2021) + 273.375); */

	}

	drawClock();
	initGeolocation();

	onWindowResize();

	setInterval(function(){
//		console.log(handData);
		updateData();
		moveHands();
	}, 100);
	//}, 546.75);

	d3.select(self.frameElement).style("height", height + "px");
}
