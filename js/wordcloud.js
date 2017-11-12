function drawWordCloud(url) {
  var width = 960, height = 600;
  var fill = d3.scale.category20();
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
    
    d3.layout.cloud()
      .size([width, height])
      .words(data)
      .rotate(function() {
        return 0;
      })
      .font("Impact")
      .text(function(d) { return d.word })
      .fontSize(function(d) {
        return d.size;
      })
      .on("end", drawCloud)
      .start();
  });

  // apply D3.js drawing API
  function drawCloud(words) {
    var cloud = d3.select("#cloud").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + ~~(width / 2) + "," + ~~(height / 2) + ")")

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 0])
      .html(function(d) {
        return "<div><span>Frequency:</span> <span style='color:white'>" + d.count + "</span></div>";
      })

      cloud.call(tip);

      cloud.selectAll("text")
        .data(words)
        .enter().append("text")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .style("font-size", function(d) {
    return d.size + "px";
        })
        .style("font-family", "Impact")
        .style("fill", function(d, i) {
    return fill(i);
        })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) {
    return d.word;
        });
  }
}
