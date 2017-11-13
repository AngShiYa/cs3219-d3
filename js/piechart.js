function drawPieChart(url, category, measure, year) {
  category = toFirstLetterUpperCase(category);
  measure = toFirstLetterUpperCase(measure);
  if (year == "") year = "All Years";
  
  var width = 960,
    height = 500,
    radius = (Math.min(width, height) * 0.8) /2,
    color = d3.scaleOrdinal(d3.schemeCategory20c);

  var arc = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius * 0.9);

  var overArc = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius * 0.95);

  var labelArc = d3.arc()
    .innerRadius(radius)
    .outerRadius(radius);

  var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

  var center = svg.append("g")
    .attr("class", "center");

  var slices = svg.append("g")
    .attr("class", "slices");

  var labels = svg.append("g")
    .attr("class", "labels");

  var lines = svg.append("g")
    .attr("class", "lines");

  var pie = d3.pie()
    .value(function(d) { return d.count; })
    .sort(null);

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
    
    data.forEach(function(d) {
      d.count = d3.sum(d.data.map(function(pair) { return pair.count; }));
    });
    var total = d3.sum(data.map(function(d) { return d.count }));

    var setCenterText = function() {
    var selected = d3.selectAll(".clicked");
    var sum = d3.sum(d3.selectAll('.clicked').data(), function(d) {
      return d.data.count;
    });

    if (selected.size() == 0) {
      center.select("circle").on("click")();
    } else {
      d3.select('.center-value').text(sum);
      d3.select('.center-percentage').text((sum/total*100).toFixed(2) + '%');
    }   
  }

  var resetCenterText = function() {
      d3.select('.center-value').text(total);
      d3.select('.center-percentage').text("100%");
  }

  // add center circle
  center.append("circle")
    .attr("r", radius * 0.5)
    .style("fill","#cccccc")
    .on("mouseover", function(d) {
      d3.select(this).transition().duration(300).attr("r", radius * 0.55);
    })
    .on("mouseout", function(d) {
      d3.select(this).transition().duration(300).attr("r", radius * 0.5);
    })
    .on("click", function(d) {
      var selected = d3.selectAll(".clicked");
      selected.classed("clicked", false);
      selected.each(function(e) {
        d3.select(this).transition().duration(300).attr("d", arc);
      })
      resetCenterText();
    })

  center.append('text')
    .attr('class', 'center-type')
    .attr('y', radius * -0.16)
    .attr('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .text("Papers");

  center.append('text')
    .attr('class', 'center-value')
    .attr('text-anchor', 'middle');

  center.append('text')
    .attr('class', 'center-percentage')
    .attr('y', radius * 0.16)
    .attr('text-anchor', 'middle')
    .style('fill', '#929292');

  resetCenterText();

  // add the slices
  var path = slices.selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) { return color(d.data.series); });

  path.on("mouseover", function(d) {
    var slice = d3.select(this);
    slice.transition().duration(300).attr("d", overArc);
    d3.select('.center-value').text(d.data.count);
    d3.select('.center-percentage').text((d.data.count/total*100).toFixed(2) + '%');
  });

  path.on("mouseout", function(d) {
    var slice = d3.select(this);
    if (!slice.classed("clicked")) {
      slice.transition().duration(300).attr("d", arc);
    }
    setCenterText();
  })

  path.on("click", function(d) {
    var slice = d3.select(this);
    slice.classed("clicked", !slice.classed("clicked"));
    if (!slice.classed("clicked")) {
      slice.transition().duration(300).attr("d", arc);
    }
    setCenterText();
  })

  // add the labels
  var text = labels.selectAll("text")
    .data(pie(data))
    .enter()
    .append("text")
    .attr('class', 'label')
    .attr('id', function(d, i) { return 'l-' + i; })
    .attr("transform", function(d) {
      var pos = labelArc.centroid(d);
      pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
      return "translate(" + pos + ")";
    })
    .style("text-anchor", function(d) {
      return midAngle(d) < Math.PI ? "start" : "end";
    })
    .attr("dy", ".35em")
    .attr("dx", ".35em")
    .text(function(d) { return d.data.series; })
    .call(wrap, width/2);

    arrangeLabels(svg, ".label");

    // ad line connectors
    var polyline = lines.selectAll("polyline")
      .data(pie(data))
      .enter()
      .append("polyline")
      .attr("points", function(d, j) {
        var offset = midAngle(d) < Math.PI ? 0 : 10;
        var label = d3.select('#l-' + j);
        var transform = getTransformation(label.attr("transform"));
        var pos = labelArc.centroid(d);
        pos[0] = transform.translateX + offset;
        pos[1] = transform.translateY;
        var mid = labelArc.centroid(d);
        mid[1] = transform.translateY;
        return [arc.centroid(d), mid, pos];
      });
        
    // Add chart title
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + 0 + ", " + ((-height / 2) + 20) + ")")
      .attr("class", "charttitle")
      .text("Composition of " + category + "s by " + measure + " in " + year);

  });
      }
