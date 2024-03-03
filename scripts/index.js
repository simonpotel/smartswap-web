document.addEventListener("DOMContentLoaded", function() {
    var ctx = document.getElementById('graph').getContext('2d');

    // create the graphic
    var chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: '',
          data: [],
          borderColor: '#8a2be2',
          backgroundColor: 'transparent',
          tension: 0.5 // hand style
        }]
      },
      options: {
        animation: {
          duration: 1000, // ms time of the animation to create graphic
          easing: 'linear'
        },
        plugins: {
          legend: {
            display: false // dont show the legend
          }
        },
        scales: {
          x: {
            display: true, 
            ticks: {
              display: false // dont show values on x 
            }
          },
          y: {
            display: true, 
            ticks: {
              display: true, 
              stepSize: 0.2 
            }
          }
        }
      }
    });

    // random values 
    var data = [];
    for (var i = 0; i < 10; i++) {
      data.push(Math.random());
    }

    // add the values to the graphic
    chart.data.labels = Array.from({length: data.length}, (_, i) => i + 1);
    chart.data.datasets[0].data = data;

    var headerText = document.querySelector("#main-content h1");
    var descriptionText = document.querySelector("#main-content p");
    var button = document.querySelector("#main-content button");

    // texts animation fade
    setTimeout(function() {
        headerText.classList.add("fade-in");
    }, 200); 

    setTimeout(function() {
        descriptionText.classList.add("fade-in");
    }, 450); 

    setTimeout(function() {
        button.classList.add("fade-in");
    }, 700);

    // show the graphic with animation
    setTimeout(function() {
        chart.options.animation.duration = 2000;
        chart.update();
    }, 1000);
});
