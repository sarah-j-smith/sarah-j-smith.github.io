//  http://tylervigen.com/page?page=1

let years = [ 2000,	2001,	2002,	2003,	2004,	2005,	2006,	2007,	2008,	2009 ];

//  Per capita consumption of cheese (US)  Pounds (USDA)  
let cheese_eating = [29.8, 30.1, 30.5, 30.6, 31.3, 31.7, 32.6, 33.1, 32.7, 32.8];

//  Number of people who died by becoming tangled in their bedsheets
// Deaths (US) (CDC)	
let bed_sheet_entanglement_deaths = [327, 456, 509, 497, 596, 573, 661, 741, 809, 717];

var regression_guess = [ 30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0, 30.0 ];

function draw_graph() {

  var dataArray = [];
  var y;
  for (y = 2000; y <= 2009; y++) {
    let ix = y - 2000;
    let newRow = [y.toString(), cheese_eating[ix], bed_sheet_entanglement_deaths[ix], regression_guess[ix]];
    dataArray.push(newRow);
  }
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Year');
  data.addColumn('number', 'Cheese eaten');
  data.addColumn('number', 'Sheet deaths');
  data.addColumn('number', 'Regression');
  data.addRows(dataArray);

  let options = {
    title: 'Bed Sheet Deaths & Cheese eating',
    width: 800,
    height: 600,
    series: {
      0: { targetAxisIndex: 0, pointSize: 10, lineWidth: 0 },
      1: { targetAxisIndex: 1, pointSize: 10, lineWidth: 0 },
      2: { targetAxisIndex: 1 }
    },
    legend: { position: 'bottom' },
    vAxes: {
      // Adds labels to each axis; they don't have to match the axis names.
      0: { title: 'Cheese eaten' },
      1: { title: 'Bed sheet deaths' }
    },
    animation: {
      duration: 1000,
      easing:'out'
    }
  };

  var chart = new google.visualization.LineChart(document.getElementById('linegraph'));

  chart.draw(data, options);
}

function show_result(prediction) {
  prediction.print();
}

function do_regression() {
  
  // Define a model for linear regression.
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // Generate some synthetic data for training.

  const xs = tf.tensor2d(years, [10, 1]);

  const ys = tf.tensor2d(bed_sheet_entanglement_deaths, [10, 1]);
//  const ys = tf.tensor2d(cheese_eating, [10, 1]);

  // Train the model using the data.
  model.fit(xs, ys).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    let prediction = model.predict(tf.tensor2d(years, [10, 1]));
    prediction.dataSync();
    show_result(prediction);
  });
}
