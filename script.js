var dataP = d3.json("https://ghibliapi.herokuapp.com/films/");

dataP.then(function(d)
{
  tabulate(d, ["title", "director", "release_date", "rt_score"]);
},
function(err)
{
  console.log(err);
});

var tabulate = function(data, columns) {
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
