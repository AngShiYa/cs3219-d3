function drawForceGraph(url) {
  var width = 960,
    height = 600,
    radius = 5,
    color = d3.scaleOrdinal(d3.schemeCategory10);
    
  var svg = d3.select("#forcegraph").append("svg")
    .attr("width", width)
    .attr("height", height);

  //add encompassing group
  var g = svg.append("g")
    .attr("class", "everything");

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<div><span>Title:</span> <span style='color:white'>" + d.title + "</span></div>" + "<div><span>Author:</span> <span style='color:white'>" + d.authors + "</span></div>" + "<div><span>Year of publication:</span> <span style='color:white'>" + d.year + "</span></div>";
    })

  svg.call(tip);

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(10).strength(0.5))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));
        
  var link = g.append("g").selectAll(".link");
  var node = g.append("g").selectAll(".node");
  var links, nodes;
      
  d3.json(url, function(error, data) {
    if (error) {
      alert("Error parsing parameters. Please try again");
    }
    if (data.error != null) {
      alert(data.error);
      return;
    }

    // Scale the range of the data
    var min = d3.min(data.nodes, function(d) { if (d.year != 0) return d.year; });
    var max = d3.max(data.nodes, function(d) { return d.year; });
      
    // Process the data
    var nodeById = d3.map(data.nodes, function(d) { return d.id; });
    data.links.forEach(function(link) {
      link.source = nodeById.get(link.source);
      link.target = nodeById.get(link.target);
    });
        
    links = data.links;
    nodes = data.nodes;
      	
    // slider
    var yearSlider = d3.select("#slider").append("input")
      .attr("type", "range")
      .attr("min", min)
      .attr("max", max)
      .attr("value", max)
      .attr("id", "yearSlider")
      .on("input", update);

    var sliderDisplay = d3.select("#slider").append("label")
      .attr("fill", "black")
      .attr("id", "sliderDisplay")
      .html("Year: " + max);

    function update() {
      selectedYear = document.getElementById("yearSlider").value;
      sliderDisplay.html("Year: " + selectedYear);
      nodes = data.nodes.filter(function(d) { return d.year <= selectedYear; });
      links = data.links.filter(function(d) {
        return nodes.some(item => item.id == d.source.id) &&
          nodes.some(item => item.id == d.target.id);
      });
      restart();
    }
      
    restart();
    
    var svg2 = d3.select("#legendarea").append("svg")
      .attr("width", 960)
      .attr("height", 50);
    
    var numGroups = d3.max(data.nodes.map(function(d) { return d.group; }));
    var legend = svg2.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" +(i * 100) + ", 0)"; });
    
    var start = Math.max(0, (960 - (100 * numGroups))/2);
    legend.append("rect")
      .attr("x", start)
      .attr("y", 20)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
      
    legend.append("path")
      .attr("d", "M" + (start-80) + " 30 l80 0 l0 0 l-10 -5 m10 5 l-10 5")
      .style("fill", "none")
      .style("stroke", function(d) {
        if (d == 1) return "none"; else return "#a3a3a3";
      });
      
    legend.append("text").attr("x", function(d) {
      if (d == 1) return start - 5; else return start - 20; })
        .attr("y", function(d) {
      if (d == 1) return 27; else return 15; })
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
      if (d == 1) return "base paper"; else return "cited by";
    });
  });

  function restart() {
    link = link.data(links);
    link.exit().remove();
    link = link.enter().append("line")
      .merge(link)
      .attr("class", "link");

    node = node.data(nodes);
    node.exit().remove();
    node = node.enter().append("circle")
        .merge(node)
        .attr("class", "node")
        .attr("r", radius)
        .attr("fill", function(d) { return color(d.group); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    simulation.nodes(nodes).on("tick", ticked);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

    function ticked() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
      node.attr("transform", positionNode);
    }
  }

  function positionNode(d) {
    return "translate(" +
      Math.max(radius, Math.min(width - radius, d.x)) + "," +
      Math.max(radius, Math.min(height - radius, d.y)) + ")";
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x, d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x, d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null, d.fy = null;
  }
}
