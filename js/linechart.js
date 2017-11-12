function drawLineChart(url) {
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 100, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // set the color of the graph
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // append svg object to the div
  // append a group element to svg
  // moves the group element to the top left margin
  var svg = d3.select("#plotarea")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  // set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var xAxis, yAxis;
  var minX, maxX, minY, maxY;

  // get the data
  d3.json(url, function(error, data) {
    if (error) {
      alert("Error parsing parameters. Please try again");
    }
    if (data.error != null) {
      alert(data.error);
      return;
    }
    if (data == "") {
      alert("No data to display");
      return;
    }

    update(data);

    color.domain(data.map(function(d) { return d.series; }));

    // Add x axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add y axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    var legend = d3.select("#dataseries").selectAll(".series")
      .data(data)
      .enter()
      .append("div")
      .attr("class", "series")

    var checkbox = legend.append("div")
      .attr("class", "checkbox")
       
    checkbox.append("input")
      .attr("class", "selection")
      .attr("checked", true)
      .attr("type", "checkbox")
      .attr("value", function(d) { return d.series; })
      .attr("id", function(d) { return d.series; })
      .on("change", selectionChanged)

    checkbox.append("label")
      .attr("for", function(d) { return d.series; })
      .style("background", function(d) { return color(d.series); })

    legend.append("text")
      .text(function(d) { return d.series; });

    function selectionChanged() {
      var selections = [];
      d3.selectAll(".selection").each(function(d) {
        var label = d3.select(this.parentNode).select("label")
        var checkbox = d3.select(this);
        if (checkbox.property("checked")) {
    selections.push(checkbox.property("value"));
    label.style("background", function(d) { return color(d.series); })
        } else {
    label.style("background", function(d) { return "#ddd"; })
        }
      });
      newData = data.filter(function(d) { return selections.indexOf(d.series) > -1 });
      update(newData);      
    }
  });

  function update(data) {
    // scale the range of the data
    minX = d3.min(data, function(kv) { return d3.min(kv.data, function(d) { return d.year; })});
    maxX = d3.max(data, function(kv) { return d3.max(kv.data, function(d) { return d.year; })});
    minY = d3.min(data, function(kv) { return d3.min(kv.data, function(d) { return d.count; })});
    maxY = d3.max(data, function(kv) { return d3.max(kv.data, function(d) { return d.count; })});

    x.domain([minX, maxX]);
    y.domain([0, maxY]);

    // set the axes
    xAxis = d3.axisBottom(x).ticks(maxX - minX).tickFormat(d3.format("d"));
    yAxis = d3.axisLeft(y).ticks(Math.min(10, maxY));

    var line = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.count); });

    var t = d3.transition().duration(300)

    svg.select(".y").transition(t).call(yAxis);
    svg.selectAll(".line").transition(t).attr("d", function(d) { return line(d.data); });

    var category = svg.selectAll(".category")
      .data(data, function(d) { return d.series; });

    category.exit().remove();

    category = category.enter().append("g")
      .attr("class", "category");

    category.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.data); })
      .style("fill", "none")
      .style("stroke", function(d) { return color(d.series); })
      .style("stroke-width", "2");

    //var lines = document.getElementsByClassName('line');
    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(data, function(d) { return d.series; });

    mousePerLine.exit().remove();

    mousePerLine = mousePerLine.enter().append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) { return color(d.series); })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mouseG.selectAll(".tooltip").remove();

    var tooltip = mouseG.append("g")
      .attr("class", "tooltip")
      .style("opacity", "0")

    var tooltipData = tooltip.selectAll(".tooltip-data")
      .data(data, function(d) { return d.series; })
      .enter().append("g")
      .attr("class", "tooltip-data")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      })

    tooltipData.append("circle")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.series); })

    tooltipData.append("text")
      .attr("class", "tooltip-data-text");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line").style("opacity", "0");
        d3.selectAll(".mouse-per-line circle").style("opacity", "0");
        d3.selectAll(".tooltip").style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line").style("opacity", "1");
        d3.selectAll(".mouse-per-line circle").style("opacity", "1");
        d3.selectAll(".tooltip").style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        var xDate, bisect, d0, d1, point;
        d3.selectAll(".mouse-per-line")
    .attr("transform", function(d, i) {
      xDate = x.invert(mouse[0]);
      bisect = d3.bisector(function(d) { return d.year; }).right;
      idx = bisect(d.data, xDate);
      d0 = d.data[idx - 1];
      d1 = d.data[idx];
      point = xDate - d0.year > d1.year - xDate ? d1 : d0;  
      return "translate(" + x(point.year) + "," + y(point.count) +")";
    });

    d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + x(point.year) + "," + height;
        d += " " + x(point.year) + "," + 0;
        return d;
    });

    d3.select(".tooltip")
      .attr("transform", "translate(" + (x(point.year) + 20) + "," + height/2 +")");

    d3.selectAll(".tooltip-data-text")
      .attr("transform", "translate(" + 10 + "," + 5 +")")
      .text(function(d) {
        return d.data
          .filter(function(pair) { return pair.year == point.year; })
          .map(function(pair) { return pair.count; });
      });
      })
  }
}
