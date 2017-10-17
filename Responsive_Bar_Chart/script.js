var labels=[], data=[], lessLabels=[], smallDataset=[];
var jsonData = $.ajax({
  url: 'Dataset/food.json',
  dataType: 'json',
}).done(function (results) {
 // Split timestamp and data into separate arrays
var i = 0;
results.forEach(function(packet) {
 // var parsed = JSON.parse(packet);  
  labels.push(packet.Description);
  data.push(parseFloat(packet.Data.Water));
  if(i < 10) {
    lessLabels.push(packet.Description);
    smallDataset.push(packet.Data.Water);
    i++;
  }
  //console.log("Labels:" + labels);
  //console.log("Data:" + data);
}
)});

var smallDataOptions = {
  legend: {
    display: true,
    labels: {
        fontColor: "#000080"
    }
  },
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    yAxes: [{
      stacked: true,
      gridLines: {
        display: true,
        color: "rgba(255,99,132,0.2)"
      }
    }],
    xAxes: [{
      gridLines: {
        display: false
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit:10,        
        maxRotation: 90,
        minRotation: 90
      }
    }]
  }
};

var chartOptions = {
  legend: {
    display: true,
    labels: {
        fontColor: "#000080"
    }
  },
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    yAxes: [{
      stacked: true,
      gridLines: {
        display: true,
        color: "rgba(255,99,132,0.2)"
      }
    }],
    xAxes: [{
      gridLines: {
        display: false
      }
    }]
  }
};

var smallData = {
  labels : lessLabels,
  datasets : [{
      label: "Dataset #1",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 2,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: smallDataset
  }]
}

// Create the chart.js data structure using 'labels' and 'data'
var largeData = {
  labels : labels,
  datasets : [{
      label: "Dataset #2",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 2,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: data
  }]
}


// var lessLabels = labels.slice(1,5);
// console.log(lessLabels);
// var smallDataset = data.slice(1,5);
// console.log(smallDataset);

// var fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
// var citrus = fruits.slice(1, 3);
// console.log(citrus);
// Create the chart.js data structure using 'labels' and 'data'

Chart.Bar('chart1', {
  options: smallDataOptions,
  data: smallData
});

// var ctx = document.getElementById("chart");

// var myChart = new Chart(ctx,{
//   type: 'Bar',
//   data: largeData,
//   options: chartOptions
// })

Chart.Bar('chart', {
  options: chartOptions,
  data: largeData
});

// var jqxhr = $.getJSON( "Dataset/immigration.json", function() {
//   console.log( "success" );
// })
//   .done(function() {
//     console.log( "second success" );
//   })
//   .fail(function() {
//     console.log( "error" );
//   })
//   .always(function() {
//     console.log( "complete" );
//   });
 
// var data = {
//   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//   datasets: [{
//     label: "Dataset #1",
//     backgroundColor: "rgba(255,99,132,0.2)",
//     borderColor: "rgba(255,99,132,1)",
//     borderWidth: 2,
//     hoverBackgroundColor: "rgba(255,99,132,0.4)",
//     hoverBorderColor: "rgba(255,99,132,1)",
//     data: [65, 59, 20, 81, 56, 55, 40],
//   }]
// };

// $.getJSON( "Dataset/food.json", function( data ) {
//   console.log('loaded');
//   var departement = []; // create array here
//   $.each(data.Water, function (index, personne) {
//       departement.push(personne.departement); //push values here
//   });
//   console.log(departement); // see the output here
// });