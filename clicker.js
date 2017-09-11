'use strict';

var firstTime = 0;
var collecting = false;
var DURATION_MS = 10 * 1000;
var UPDATE_DELAY_MS = 100;
var chart = undefined;

function clicker() {
  if (!collecting) {
    return;
  }
  var now = (new Date).getTime();
  if (firstTime === 0) {
    $("#message").text("Started!");
    setTimeout(timerUpdate, UPDATE_DELAY_MS);    
    firstTime = now;
  }
  var diff = now - firstTime;
  var sec = Math.floor(diff/1000);
  updateData(sec);
}

function updateData(sec) {
  if (chart.series[0].data.length > sec) {
    var y = chart.series[0].data[sec].y;
    chart.series[0].data[sec].update(y+1);
  } else {
    chart.series[0].addPoint([sec,1], true, false);
  }
}

function start() {
  collecting = true;
  firstTime = 0;
  initialize();
  $("#message").text("First click will begin!");
  $("#start-button").prop("disabled", true);
  setTimeout(timerEnd, DURATION_MS);
}

function timerEnd() {
  var av = calcAverage(chart.series[0]);
  var mx = calcMax(chart.series[0]);
  $("#message").text("Done! Peak rate was " + mx + "cps and average rate was " + av + "cps.");
  $("#start-button").prop("disabled", false);
  collecting = false;
}

function timerUpdate() {
  if (collecting) {
    var now = (new Date).getTime();
    $("#message").text("Time left: " + (firstTime+DURATION_MS-now)/1000.0 + " seconds.");
    setTimeout(timerUpdate, UPDATE_DELAY_MS);
  }
}

function initialize() {
  chart = createChart();  
}

function createChart() {
  return new Highcharts.Chart({
    chart: {
        renderTo: 'chart',
        type: 'column',
        animation: false,
    },
    xAxis: {
      allowDecimals: false,
    },
    yAxis: {
      min: 0,
      max: 20,
      label: "Clicks per second"
    },
    title: {
        text: ''
    },
    series: [{name: "clicks", data: []}]
  });
}

function calcAverage(series) {
  if (series.data.length === 0) 
    return 0;

  var total = 0;
  for (var i = 0; i < series.data.length; i++) {
    total += series.data[i].y;
  }

  var av = Math.round(total / series.data.length*100)/100.0;
  return av;
}

function calcMax(series) {
  if (series.data.length === 0) 
    return 0;

  var mx = 0;
  for (var i = 0; i < series.data.length; i++) {
    if (series.data[i].y > mx)
      mx = series.data[i].y;
  }
  return mx;  
}