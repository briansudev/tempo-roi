function Bar(svgID, data, gridLabelText, barLabelText) {
    console.log(gridLabelText);
	this.svgID = svgID;
	this.data = data;
    this.gridLabelText = gridLabelText;
    this.barLabelText = barLabelText;
    
	this.valueLabelWidth = 110; // space reserved for value labels (right)
	this.barHeight = 20; // height of one bar
	this.barLabelWidth = 285; // space reserved for bar labels
	this.barLabelPadding = 5; // padding between bar and bar labels (left)
	this.gridLabelHeight = 18; // space reserved for gridline labels
	this.gridChartOffset = 3; // space between start of grid and first bar
	this.maxBarWidth = 200; // width of the bar with the max value

	this.x = null;
	this.y = null;
	this.yScale = null;
	this.yText = null;
	this.chart = null;
	this.barsContainer = null;
	this.gridContainer = null;
    this.labelsContainer = null;
    this.barLabel = function(m) { return info[m]; };
    this.barValue = function(m) { return parseFloat(d[m]()); };
}

Bar.prototype.initialize = function() {

    // scales
	this.updateScales();

    // svg container element
	this.chart = d3.select(this.svgID).append("svg")
		.attr('width', this.maxBarWidth + this.barLabelWidth + this.valueLabelWidth)
        .attr('height', this.gridLabelHeight + this.gridChartOffset + this.data.length * this.barHeight);

    // grid
    this.gridContainer = this.chart.append('g')
        .attr('transform', 'translate(' + this.barLabelWidth + ',' + this.gridLabelHeight + ')');
    this.gridContainer.selectAll("text").data(this.x.ticks(2)).enter().append("text")
        .attr("x", this.x)
        .attr("dy", -3)
        .attr("text-anchor", "middle")
        .attr("class", "line-labels")
        .text(this.gridLabelText);
	this.gridContainer.selectAll("line").data(this.x.ticks(2)).enter().append("line")
	  .attr("x1", this.x)
	  .attr("x2", this.x)
	  .attr("y1", 0)
	  .attr("id", "lines")
	  .attr("y2", this.yScale.rangeExtent()[1] + this.gridChartOffset)
	  .style("stroke", "#ccc");
    
    // bar labels
    this.labelsContainer = this.chart.append('g')
        .attr('transform', 'translate(' + (this.barLabelWidth - this.barLabelPadding) + ',' + (this.gridLabelHeight + this.gridChartOffset) + ')');
    this.labelsContainer.selectAll('text').data(this.data).enter().append('text')
        .attr('y', this.yText)
        .attr('stroke', 'none')
        .attr('fill', 'black')
        .attr("dy", ".35em") // vertical-align: middle
        .attr('text-anchor', 'end')
        .text(this.barLabel);

    this.barsContainer = this.chart.append('g')
      .attr('transform', 'translate(' + this.barLabelWidth + ',' + (this.gridLabelHeight + this.gridChartOffset) + ')');

    this.createBars();
};

Bar.prototype.createBars = function() {
    var self = this;
    this.barsContainer.selectAll("rect").data(this.data).enter().append("rect")
      .attr('y', this.y)
      .attr('height', this.yScale.rangeBand())
      .attr('width', function(d) { return self.x(self.barValue(d)); })
      .attr('stroke', 'white')
      .attr('fill', '#032C41')
      .attr("id", function(d) { return d + '-bar';});

    // bar value labels
    this.barsContainer.selectAll("text").data(this.data).enter().append("text")
      .attr("x", function(d) { return self.x(self.barValue(d)); })
      .attr("y", this.yText)
      .attr("dx", 3) // padding-left
      .attr("dy", ".35em") // vertical-align: middle
      .attr("text-anchor", "start") // text-align: right
      .attr("fill", "black")
      .attr("stroke", "none")
      .text(function(d) { return self.barLabelText(d, self) });

    // start line
    this.barsContainer.append("line")
      .attr("y1", -this.gridChartOffset)
      .attr("y2", this.yScale.rangeExtent()[1] + this.gridChartOffset)
      .style("stroke", "#000");
};

Bar.prototype.update = function() {
    console.log("update called");
    this.updateScales();
    this.updateBars();
    this.updateGrid();
};

Bar.prototype.updateScales = function() {
    var self = this;
    this.yScale = d3.scale.ordinal().domain(d3.range(0, this.data.length)).rangeBands([0, this.data.length * this.barHeight]);
    this.y = function(d, i) { return self.yScale(i); };
    this.yText = function(d, i) { return self.y(d, i) + self.yScale.rangeBand() / 2 };
    this.x = d3.scale.linear().domain([0, d3.max(this.data, this.barValue)]).range([0, this.maxBarWidth]);
};

Bar.prototype.updateBars = function() {
    var self = this;
    this.barsContainer.selectAll("rect").transition().attr("width", function(d) {return self.x(self.barValue(d))});
    this.barsContainer.selectAll("text")
        .transition()
        .attr("x", function(d) { return self.x(self.barValue(d)); })
        .attr("y", this.yText)
        .text(function(d) { return self.barLabelText(d, self); });
    this.barsContainer.selectAll("line").transition()
      .attr("y1", -this.gridChartOffset)
      .attr("y2", this.yScale.rangeExtent()[1] + this.gridChartOffset)
      .style("stroke", "#000");
};

Bar.prototype.updateGrid = function() {
    this.gridContainer.selectAll("text").data(this.x.ticks(2)).enter().append("text")
          .attr("x", this.x)
          .attr("dy", -3)
          .attr("text-anchor", "middle")
          .attr("class", "line-labels")
          .text(this.gridLabelText);

    this.gridContainer.selectAll("text").transition()
      .attr("x", this.x)
      .text(this.gridLabelText);

    this.gridContainer.selectAll("line").data(this.x.ticks(2)).enter().append("line")
      .attr("x1", this.x)
      .attr("x2", this.x)
      .attr("y1", 0)
      .attr("id", "lines")
      .attr("y2", this.yScale.rangeExtent()[1] + this.gridChartOffset)
      .style("stroke", "#ccc");

    this.gridContainer.selectAll("line").transition()
      .attr("x1", this.x)
      .attr("x2", this.x)
      .attr("y1", 0)
      .attr("id", "lines")
      .attr("y2", this.yScale.rangeExtent()[1] + this.gridChartOffset);

    this.gridContainer.selectAll("text").data(this.x.ticks(2)).exit().remove();
    this.gridContainer.selectAll("line").data(this.x.ticks(2)).exit().remove();
};