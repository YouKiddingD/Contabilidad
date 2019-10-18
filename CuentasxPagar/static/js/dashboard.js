var DATA_COUNT = 16;
    	var MIN_XY = -125;
    	var MAX_XY = 95;

    	var utils = Samples.utils;
    	var ctx = $('#animate-chart');

    	utils.srand(110);

    	function colorize(opaque, context) {
    		var value = context.dataset.data[context.dataIndex];
    		var x = value.x / 100;
    		var y = value.y / 100;
    		var r = x < 0 && y < 0 ? 250 : x < 0 ? 150 : y < 0 ? 50 : 0;
    		var g = x < 0 && y < 0 ? 0 : x < 0 ? 50 : y < 0 ? 150 : 250;
    		var b = x < 0 && y < 0 ? 0 : x > 0 && y > 0 ? 250 : 150;
    		var a = opaque ? 1 : 0.5 * value.v / 1000;

    		return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    	}

    	function generateData() {
    		var data = [];
    		var i;

    		for (i = 0; i < DATA_COUNT; ++i) {
    			data.push({
    				x: utils.rand(MIN_XY, MAX_XY),
    				y: utils.rand(MIN_XY, MAX_XY),
    				v: utils.rand(0, 1000)
    			});
    		}

    		return data;
    	}

    	var data = {
    		datasets: [{
    			data: generateData()
    		}, {
    			data: generateData()
    		}]
    	};

    	var options = {
    		maintainAspectRatio: false,
    		responsive: false,
    		legend: false,
    		tooltips: false,
    		scales: {
    			xAxes: [{
    				display: false
    			}],
    			yAxes: [{
    				display: false
    			}],
    		},

    		elements: {
    			point: {
    				backgroundColor: colorize.bind(null, false),

    				borderColor: colorize.bind(null, false),

    				radius: function(context) {
    					var value = context.dataset.data[context.dataIndex];
    					var size = context.chart.width;
    					var base = Math.abs(value.v) / 1000;
    					return (size / 24) * base;
    				}
    			}
    		}
    	};

    	var chart = new Chart(ctx, {
    		type: 'bubble',
    		data: data,
    		options: options
    	});

		// eslint-disable-next-line no-unused-vars
		function randomize() {
			chart.data.datasets.forEach(function(dataset) {
				dataset.data = generateData();
			});
			chart.update();
		}

		// eslint-disable-next-line no-unused-vars
		function addDataset() {
			chart.data.datasets.push({
				data: generateData()
			});
			chart.update();
		}

		// eslint-disable-next-line no-unused-vars
		function removeDataset() {
			chart.data.datasets.shift();
			chart.update();
		}

		setInterval(randomize, 2000);