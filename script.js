var dataP = d3.json("https://ghibliapi.herokuapp.com/films/");

dataP.then(function(d)
{
  createTable(d, ["title", "director", "release_date", "rt_score"]);
  drawLineChart(d);
},
function(err)
{
  console.log(err);
});

var createTable = function(data, columns) {
		var table = d3.select('body').append('table')
		var thead = table.append('thead')
		var	tbody = table.append('tbody');

		// append the header row
		thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(function (column) { return column.toUpperCase(); });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
              		  .data(data)
              		  .enter()
              		  .append('tr');

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
              		  .data(function (row) {
              		    return columns.map(function (column) {
              		      return {column: column, value: row[column]};
              		    });
              		  })
              		  .enter()
              		  .append('td')
              		  .text(function (d) { return d.value; });
}

var drawLineChart = function(data)
{
  // setup
  var screen = {
    width: 800,
    height: 700
  };

  var margins = {
    left: 50,
    top: 20,
    bottom: 280,
    right: 0
  };

  var width = screen.width - margins.left - margins.right;
  var height = screen.height - margins.top - margins.bottom;

  var xScale = d3.scaleLinear()
                 .domain([0, data.length])
                 .range([margins.left, width]);

  var yScale = d3.scaleLinear()
                 .domain([30, 100])
                 .range([height, margins.top]);

  var svg = d3.select("body")
              .append("svg")
              .attr("Class", "lineChart")
              .attr("width", screen.width)
              .attr("height", screen.height)

  // modify the original data
  var rtScoreData = getRtScoreData(data);
  var titleData = getTitleData(data);
  // console.log(rtScoreData);

  // draw line
  var drawLine = d3.line()
                   .x(function(d, i) {return margins.left/2 + xScale(i);})
                   .y(function(d) {return yScale(d);});

  svg.append("g")
     .attr("class", "lines")
     .append("path")
     .datum(rtScoreData)
     .attr("d", drawLine)
     .attr("fill", "none")
     .attr("stroke", "#007B8E")
     .attr("stroke-width", 3)

  svg.append("g")
     .attr("class", "dots")
     .selectAll("circle")
     .data(rtScoreData)
     .enter()
     .append("circle")
     .attr("class", "dot")
     .attr("cx", function(d, i) {return margins.left/2 + xScale(i);})
     .attr("cy", function(d) {return yScale(d);})
     .attr("r", 5)
     .attr("fill", "#003C68")
     .on("mouseover", function(d, i) {
       d3.select(this)
         .attr("r", 7);
         //.attr("fill", "white");

       svg.append("text")
          .attr("id", "text" + i + "-" + d)
          .attr("x", function() {return margins.left/2 + xScale(i) - 49;})
          .attr("y", function() {return yScale(d) + 42;})
          .text(function() {return "RT Score: " + d;})
          .attr("fill", "#003C68")
          .attr("font-size", 18);
      })
     .on("mouseout", function(d, i) {
       d3.select(this)
         .attr("r", 5);
         //.attr("fill", "black");

       d3.select("#text" + i + "-" + d).remove();
     });

  //yAxis
  var yAxis = d3.axisLeft()
                .scale(yScale);

  svg.append("g")
     .attr("class", "yAxis")
     .attr("transform", "translate(" + margins.left + ",0)")
     .call(yAxis)

  //xAxis
  var xAxis = svg.append("g")
  xAxis.attr("class", "xAxis")
       .selectAll("text")
       .data(titleData)
       .enter()
       .append("text")
       .text(function(d) {return d;})
       .attr("x", function() {return -(screen.height - margins.bottom);})
       .attr("y", function(d,i) {return margins.left/2 + 7 + xScale(i);})
       .style("text-anchor","end")
       .attr("transform","rotate(-90)");

  //draw the xLine
  var xLine = svg.append("line")
                 .attr("class", "xAxis")
                 .attr("x1", margins.left)
                 .attr("y1", height + 0.5)
                 .attr("x2", xScale(20) + margins.left/2 - 7)
                 .attr("y2", height + 0.5)
                 .attr("stroke", "black");


  var verticalLines = svg.append("g")
                         .attr("class", "verticalLines")

  rtScoreData.forEach(function(d, i) {
    verticalLines.append("line")
                 .attr("class", "verticalLine")
                 .attr("x1", margins.left/2 + xScale(i))
                 .attr("y1", yScale(d) + 3.5)
                 .attr("x2", margins.left/2 + xScale(i))
                 .attr("y2", height + 0.5)
                 .attr("stroke", "#003C68");
  })

}

var getRtScoreData = function(data)
{
  var rtScoreData = []

  for (i = 0; i < data.length; i++) {
    rtScoreData.push(data[i].rt_score)
  }
  // console.log(rtScoreData)
  return rtScoreData;
}

var getTitleData = function(data)
{
  var titleData = []

  for (i = 0; i < data.length; i++) {
    titleData.push("(" + data[i].release_date +") " + data[i].title)
  }
  // console.log(titleData)
  return titleData;
}
