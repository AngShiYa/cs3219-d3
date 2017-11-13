function drawBarChart(url, category, measure) {
  if (count <= 0) {
    alert("Count must be larger than 0");
    return;
  }

  category = toFirstLetterUpperCase(category);
  measure = toFirstLetterUpperCase(measure);
    
    d3.json(url, function(error, data) {
      if (error) {
        alert("Error parsing parameters. Please try again");
      }
      if (data.error != null) {
        alert(data.error);
        return;
      }
      if(data == "") {
        alert("No data to display");
        return;
      }
      
        var margin = {top: 80, right: 25, bottom: 60, left: 250};
  var width = 960 - margin.left - margin.right;
  var height = 150 + (data.length * 70) - margin.top - margin.bottom;

  var chart = d3.select("#barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<div><span>" + category + ": </span><span style='color:white'>" + d.series + "</span></div>" + "<div><span>Total " + measure +"s: </span><span style='color:white'>" + d.count + "</span></div>";
    })

    chart.call(tip);
    
      data = data.sort(function(x, y) {
        return d3.ascending(x.count, y.count) ||
        d3.descending(x.series, y.series);
      })
    
      var max = d3.max(data, function(d) { return d.count; });
      var ticks = Math.min(10, max);

      var x = d3.scale.linear()
        .range([0, width])
        .domain([0, d3.max(data, function(d) { return d.count; })]);

      var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .1)
        .domain(data.map(function(d) { return d.series; }));
        
      var xAxis = d3.svg.axis()
        .ticks(ticks)
        .tickFormat(d3.format(".0f"))
        .scale(x)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(0)
        .orient("left");

      // Add x axis
      chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

      // Add x axis label
      chart.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + width/2 + ", " + (height + 50) + ")")
        .attr("class", "label")
        .text("Number of " + measure + "s");

      // Add x axis grid lines
      chart.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis.tickSize(-height, 0, 0).tickFormat(""));

      // Add bars
      var bar = chart.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")

      bar.append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("width", function(d) { return x(d.count); })
        .attr("y", function(d) { return y(d.series); })
        .attr("height", y.rangeBand())
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

      // Add y axis
      chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
        .attr("transform", "translate(-10, -20)")
        .attr("height", "80px")
        .attr("dominant-baseline", "text-before-edge")
        .call(wrap, y.rangeBand() + 110);

      // Add y axis label
      chart.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (0 - (margin.left/2 + 100)) + "," + (height/2)  +")rotate(-90)")
        .attr("class", "label")
        .text(category + "s");

      // Add chart title
      chart.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + width/2 + ", " + (0 - (margin.top/2) + 10) + ")")
        .attr("class", "charttitle")
        .text("Top " + data.length + " " + category + "s by Number of " + measure);
        
    });
  }
