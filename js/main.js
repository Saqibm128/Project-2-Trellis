// **** Your JavaScript code goes here ****
var svg = d3.select('svg').append("g")

currXField = "year_built"
currYField = "price_per_sqft"
currXName = "Year Built"
currYName = "Price Per Square Feet (USD)"
plot(currXField, currYField, currXName, currYName);
function plot(xField, yField, xName, yName) {
  d3.csv('data/real_estate.csv', function(error, dataset) {
    if (error === true) {
      console.error('Error Occurred');
      console.error(error);
    }
    svg.selectAll("*").remove();
    var byLocation = d3.nest()
      .key(function(datum) {
        return datum.location;
      })
      .entries(dataset);
    var locations = byLocation.map(
      function(datum) {
        return datum.key;
      }
    );

    //Make height of svg view dependent on total number of locations available in dataset
    var height = Math.ceil(locations.length / 2) * 350;
    svg.attr("height", height)
    var trellisG = svg.selectAll("#trellis")
      .data(byLocation)
      .enter()
      .append("g")
      .attr("class", function(datum) {
        return "trellis ";
      })
      .attr("height", 320)
      .attr("width", 320)
      .attr("transform", function(datum, i) {
        var transX;
        var transY;
        if (i % 2 == 1) {
          transX = 360;
        } else {
          transX = 20;
        }
        transY = Math.floor(i / 2) * 340 + 20;
        return "translate(" + String(transX) + "," + String(transY) + ")";
      })
    var xScale = d3.scaleLinear().domain([d3.min(dataset, function(datum) {
        return +datum[xField];
      }), d3.max(dataset, function(datum) {
        return +datum[xField];
      })])
      .range([60, 280]);

    var yScale = d3.scaleLinear().domain([d3.min(dataset, function(datum) {
        return +datum[yField];
      }), d3.max(dataset, function(datum) {
        return +datum[yField];
      })])
      .range([280, 60]);
    var xAxis = d3.axisBottom(xScale).ticks(5)
    trellisG.append('g').attr('class', 'x axis').attr('transform', 'translate(0, 280)').call(xAxis);
    trellisG.append('text').attr('class', 'x label').attr('transform', 'translate(150, 320)').text(xName)
    var yAxis = d3.axisLeft(yScale).ticks(5);
    trellisG.append('g').attr('class', 'y axis').attr('transform', 'translate(60, 0)').call(yAxis);
    trellisG.append('text').attr('class', 'y label').attr('transform', 'translate(0, 250) rotate(270 0,0) ').text(yName)
    trellisG.append('text').attr('class', 'city').attr('transform', 'translate(150, 60)').text(function(d) {
      return d.key
    });
    trellisG.append('g').each(
      function(d) {
        d3.select(this)
          .selectAll("#dots")
          .data(d.values)
          .enter()
          .append('circle')
          .attr("class", "dots")
          .attr("r", "2")
          .attr("cx", function(d) {
            return +xScale(d[xField]);
          }).attr("cy", function(d) {
            return (yScale(d[yField]));
          }).attr("fill", function(d) {
            if (d.beds > 2) {
              return "#2e5d90";
            } else {
              return "#499936";
            }
          })
      });
  });
}
$(document).ready(function() {
  $(".y_buttons > label").on("click", function(event) {
    console.log($(this).attr("value"));
    currYField = $(this).attr("value");
    currYName = $(this).text().trim();
    console.log(currYName)
    plot(currXField, currYField, currXName, currYName);
  });
  $(".x_buttons > label").on("click", function(event) {
    console.log($(this).attr("value"));
    currXField = $(this).attr("value");
    currXName = $(this).text().trim();
    plot(currXField, currYField, currXName, currYName);
  });
});