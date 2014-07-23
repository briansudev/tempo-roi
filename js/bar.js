// accessor functions 
var barLabel = function(m) { return info[m]; };
var barValue = function(m) { return parseFloat(d[m]()); };
var data = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'];
var x;
var y;
var yScale;
var yText;
var chart;
var barsContainer;
var gridContainer;
var valueLabelWidth = 90; // space reserved for value labels (right)
var barHeight = 20; // height of one bar
var barLabelWidth = 285; // space reserved for bar labels
var barLabelPadding = 5; // padding between bar and bar labels (left)
var gridLabelHeight = 18; // space reserved for gridline labels
var gridChartOffset = 3; // space between start of grid and first bar
var maxBarWidth = 420; // width of the bar with the max value

function generateBarC() {

	// scales
	yScale = d3.scale.ordinal().domain(d3.range(0, data.length)).rangeBands([0, data.length * barHeight]);
	y = function(d, i) { return yScale(i); };
	yText = function(d, i) { return y(d, i) + yScale.rangeBand() / 2; };
	x = d3.scale.linear().domain([0, d3.max(data, barValue)]).range([0, maxBarWidth]);

	// svg container element
	chart = d3.select('#chart').append("svg")
	  .attr('width', maxBarWidth + barLabelWidth + valueLabelWidth)
	  .attr('height', gridLabelHeight + gridChartOffset + data.length * barHeight);

	// grid line labels
	gridContainer = chart.append('g')
	  .attr('transform', 'translate(' + barLabelWidth + ',' + gridLabelHeight + ')'); 
	gridContainer.selectAll("text").data(x.ticks(5)).enter().append("text")
	  .attr("x", x)
	  .attr("dy", -3)
	  .attr("text-anchor", "middle")
	  .attr("class", "line-labels")
	  .text(function(d) { return "$" + String(d / 1000) + "k/yr" });

	// vertical grid lines
	gridContainer.selectAll("line").data(x.ticks(5)).enter().append("line")
	  .attr("x1", x)
	  .attr("x2", x)
	  .attr("y1", 0)
	  .attr("id", "lines")
	  .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
	  .style("stroke", "#ccc");

	// bar labels
	var labelsContainer = chart.append('g')
	  .attr('transform', 'translate(' + (barLabelWidth - barLabelPadding) + ',' + (gridLabelHeight + gridChartOffset) + ')'); 
	labelsContainer.selectAll('text').data(data).enter().append('text')
	  .attr('y', yText)
	  .attr('stroke', 'none')
	  .attr('fill', 'black')
	  .attr("dy", ".35em") // vertical-align: middle
	  .attr('text-anchor', 'end')
	  .text(barLabel);

	// bars
	barsContainer = chart.append('g')
	  .attr('transform', 'translate(' + barLabelWidth + ',' + (gridLabelHeight + gridChartOffset) + ')');
	createBars();

}

function createBars() {
	console.log('create bars called')
	barsContainer.selectAll("rect").data(data).enter().append("rect")
	  .attr('y', y)
	  .attr('height', yScale.rangeBand())
	  .attr('width', function(d) { return x(barValue(d)); })
	  .attr('stroke', 'white')
	  .attr('fill', '#032C41')
	  .attr("id", function(d) { return d + '-bar';});

	// bar value labels
	barsContainer.selectAll("text").data(data).enter().append("text")
	  .attr("x", function(d) { return x(barValue(d)); })
	  .attr("y", yText)
	  .attr("dx", 3) // padding-left
	  .attr("dy", ".35em") // vertical-align: middle
	  .attr("text-anchor", "start") // text-align: right
	  .attr("fill", "black")
	  .attr("stroke", "none")
	  .text(function(d) { return "$" + d3.round(barValue(d), 2); });

	// start line
	barsContainer.append("line")
	  .attr("y1", -gridChartOffset)
	  .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
	  .style("stroke", "#000");
}

function updateBars() {
	x = d3.scale.linear().domain([0, d3.max(data, barValue)]).range([0, maxBarWidth]);
	barsContainer.selectAll("rect").transition().attr("width", function(d) {return x(barValue(d))});
	barsContainer.selectAll("text")
		.transition()
		.attr("x", function(d) { return x(barValue(d)); })
		.attr("y", yText)
		.text(function(d) { return d3.round(barValue(d), 2); });

	barsContainer.selectAll("line").transition()
	  .attr("y1", -gridChartOffset)
	  .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
	  .style("stroke", "#000");

	gridContainer.selectAll("text").data(x.ticks(5)).enter().append("text")
		  .attr("x", x)
		  .attr("dy", -3)
		  .attr("text-anchor", "middle")
		  .attr("class", "line-labels")
		  .text(function(d) { return "$" + String(d / 1000) + "k/yr" });

	gridContainer.selectAll("text").transition()
	  .attr("x", x)
	  .attr("dy", -3)
	  .attr("text-anchor", "middle")
	  .text(function(d) { return "$" + String(d / 1000) + "k/yr" });

	gridContainer.selectAll("line").data(x.ticks(5)).enter().append("line")
	  .attr("x1", x)
	  .attr("x2", x)
	  .attr("y1", 0)
	  .attr("id", "lines")
	  .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
	  .style("stroke", "#ccc");

	gridContainer.selectAll("line").transition()
	  .attr("x1", x)
	  .attr("x2", x)
	  .attr("y1", 0)
	  .attr("id", "lines")
	  .attr("y2", yScale.rangeExtent()[1] + gridChartOffset);

	gridContainer.selectAll("text").data(x.ticks(5)).exit().remove();
	gridContainer.selectAll("line").data(x.ticks(5)).exit().remove();

}