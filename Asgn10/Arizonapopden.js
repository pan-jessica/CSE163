/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

var margin = {top: 50, right: 80, bottom: 50, left: 80},
    width = 960 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);


var path = d3.geoPath();

var color = d3.scaleThreshold()
    .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
    .range(d3.schemeOrRd[9]);

var sc = d3.scaleSqrt()
    .domain([0, 4500])
    .rangeRound([440, 950]);


var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// creating the legend/scale of population density
var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(-430,960)");

g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = sc.domain()[0];
      if (d[1] == null) d[1] = sc.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return sc(d[0]); })
    .attr("width", function(d) { return sc(d[1]) - sc(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

g.append("text")
    .attr("class", "caption")
    .attr("x", sc.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Population per square mile");

g.call(d3.axisBottom(sc)
    .tickSize(13)
    .tickValues(color.domain()))
  .select(".domain")
    .remove();


// reading data in from json file
d3.json("az.json").then(function(arizona) {
    console.log(arizona);
    console.log(topojson.feature(arizona, arizona.objects.tracts).features)

  // map the topography of the state with the color scale
  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(arizona, arizona.objects.tracts).features)
    .enter().append("path")
      .attr("fill", function(d) { return color(d.properties.density); })
      .attr("d", path)
    .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html("Population Density: " + d.properties.density)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
    .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

  // display the borders to each county within the state
  svg.append("path")
    .datum(topojson.feature(arizona, arizona.objects.counties))
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.5)
    .attr("d", path);
  svg.append("path")
    .datum(topojson.feature(arizona, arizona.objects.tracts))
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.4)
    .attr("d", path);

});

var track = 0;

var tsb = true;
var tctb = true;

function toggleColor() {
  if (track == 0) {
      track += 1;
      tsb = true;
      tctb = true;
      color.range(d3.schemeYlGnBu[9]);
    
      var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(-430,960)");

      g.selectAll("rect")
        .data(color.range().map(function(d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = sc.domain()[0];
            if (d[1] == null) d[1] = sc.domain()[1];
            return d;
            }))
        .enter().append("rect")
            .attr("height", 8)
            .attr("x", function(d) { return sc(d[0]); })
            .attr("width", function(d) { return sc(d[1]) - sc(d[0]); })
            .attr("fill", function(d) { return color(d[0]); });

      g.append("text")
            .attr("class", "caption")
            .attr("x", sc.range()[0])
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text("Population per square mile");

      g.call(d3.axisBottom(sc)
            .tickSize(13)
            .tickValues(color.domain()))
          .select(".domain")
            .remove();

      d3.json("az.json").then(function(arizona) {

        svg.append("g")
            .selectAll("path")
            .data(topojson.feature(arizona, arizona.objects.tracts).features)
            .enter().append("path")
                .attr("fill", function(d) { return color(d.properties.density); })
                .attr("d", path)
            .on("mouseover", function(d) {		
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div	.html("Population Density: " + d.properties.density)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");	
                    })					
            .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
            });

        svg.append("path")
            .datum(topojson.feature(arizona, arizona.objects.counties))
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.5)
            .attr("d", path);
        svg.append("path")
            .datum(topojson.feature(arizona, arizona.objects.tracts))
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.4)
            .attr("d", path);
      });
  } else {
      track -= 1;
      tsb = true;
      tctb = true;
      color.range(d3.schemeOrRd[9]);

      var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(-430,960)");

      g.selectAll("rect")
        .data(color.range().map(function(d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = sc.domain()[0];
            if (d[1] == null) d[1] = sc.domain()[1];
            return d;
          }))
        .enter().append("rect")
          .attr("height", 8)
          .attr("x", function(d) { return sc(d[0]); })
          .attr("width", function(d) { return sc(d[1]) - sc(d[0]); })
          .attr("fill", function(d) { return color(d[0]); });

      g.append("text")
          .attr("class", "caption")
          .attr("x", sc.range()[0])
          .attr("y", -6)
          .attr("fill", "#000")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Population per square mile");

      g.call(d3.axisBottom(sc)
          .tickSize(13)
          .tickValues(color.domain()))
        .select(".domain")
          .remove();

      d3.json("az.json").then(function(arizona) {

        svg.append("g")
          .selectAll("path")
          .data(topojson.feature(arizona, arizona.objects.tracts).features)
          .enter().append("path")
            .attr("fill", function(d) { return color(d.properties.density); })
            .attr("d", path)
          .on("mouseover", function(d) {		
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div	.html("Population Density: " + d.properties.density)	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })					
          .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
          });
        
        svg.append("path")
          .datum(topojson.feature(arizona, arizona.objects.counties))
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.5)
          .attr("d", path);
        svg.append("path")
          .datum(topojson.feature(arizona, arizona.objects.tracts))
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.4)
          .attr("d", path);
        });
  }
}






function tsbf() {
//    console.log(tsb);
    if (tsb == false) {
        tsb = true;
//        console.log(tsb);
        d3.json("az.json").then(function(arizona) {

          svg.append("g")
            .selectAll("path")
            .data(topojson.feature(arizona, arizona.objects.tracts).features)
            .enter().append("path")
              .attr("fill", function(d) { return color(d.properties.density); })
              .attr("d", path)
            .on("mouseover", function(d) {		
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div	.html("Population Density: " + d.properties.density)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");	
                    })					
            .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });
        
          svg.append("path")
            .datum(topojson.feature(arizona, arizona.objects.counties))
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.5)
            .attr("d", path);
            
        });
    } else {
        tsb = false;
//        console.log(tsb);
        d3.json("az.json").then(function(arizona) {

          svg.append("g")
            .selectAll("path")
            .data(topojson.feature(arizona, arizona.objects.tracts).features)
            .enter().append("path")
              .attr("fill", function(d) { return color(d.properties.density); })
              .attr("d", path)
            .on("mouseover", function(d) {		
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div	.html("Population Density: " + d.properties.density)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");	
                    })					
            .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });

          svg.append("path")
            .datum(topojson.feature(arizona, arizona.objects.counties))
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 0.5)
            .attr("d", path);
        
        });
    }
}
    
function tctbf() {
    if (tctb == true) {
        tctb = false;
        d3.json("az.json").then(function(arizona) {
          svg.append("g")
            .selectAll("path")
            .data(topojson.feature(arizona, arizona.objects.tracts).features)
            .enter().append("path")
              .attr("fill", function(d) { return color(d.properties.density); })
              .attr("d", path)
            .on("mouseover", function(d) {		
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div	.html("Population Density: " + d.properties.density)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");	
                    })					
            .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });
          svg.append("path")
            .datum(topojson.feature(arizona, arizona.objects.counties))
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.5)
            .attr("d", path);

          svg.append("path")
            .datum(topojson.feature(arizona, arizona.objects.tracts))
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 0)
            .attr("d", path);
        
        });
    } else {
        tctb = true;
        d3.json("az.json").then(function(arizona) {

          svg.append("g")
            .selectAll("path")
            .data(topojson.feature(arizona, arizona.objects.tracts).features)
            .enter().append("path")
              .attr("fill", function(d) { return color(d.properties.density); })
              .attr("d", path)
            .on("mouseover", function(d) {		
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div	.html("Population Density: " + d.properties.density)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");	
                    })					
            .on("mouseout", function(d) {		
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                });
            
          svg.append("path")
            .datum(topojson.feature(arizona, arizona.objects.counties))
            .attr("fill", "none")
            .attr("stroke", "#fff")
            .attr("stroke-opacity", 0.5)
            .attr("d", path);
            
          svg.append("path")
            .datum(topojson.feature(arizona, arizona.objects.tracts))
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.4)
            .attr("d", path);
        
        });
    }
}