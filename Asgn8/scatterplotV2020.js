/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

/*
Actions required to support pan+drag, zoom-in and zoom-out, and 
country name/tooltip:

(i) pan-drag: This function is supported. If you hold your cursor on a cirlce
on the scatter plot, then as you hold your cursor, you drag your mouse in any 
direction, the scatter plot will move with it. As the scatterplot moves, the 
x-axis and the y-axis are scalled automatically.

(ii) zoom-in and zoom-out: This function is supported. If you move your mouse
onto a circle then scroll up (moving finger out) then you'll be able to zoom-in
on the circle. To zoom-out you just have to do the opposite and scroll down
(moving finger inward) when your cursor is over a circle. As you zoom-in and 
zoom-out the x-axis and y-axis will scale automatically.

(iii) country name/tooltip: This function is supported. Each circle represents
a specific country so every circle has their name written next to their circle
(slightly overlapping). If you hover your cursor over the circle for a specific
country, a tooltip of the country will show up. It'll show the poplulation, gdp,
epc and total energy consumption (total) for that country. When you move your 
cursor off the circle, the tooltip will disappear.

    As you do functions (i) and (ii) above, the country name and tooltip to
each country will move along with it. So if you did the pan-drag-zoom, you will
still be able to see the country name and tooltip (if you hover cursor over
circle) for each country right next to the circle.
*/


/*
***NOTE: my x-axis and y-axis don't start at 0 when the webpage is loaded.
instead it starts at the lowest gdp value out of all the countries for the 
x-axis and the lowest epc value out of all the countries for the y-axis. (Once
you do use pan-drag-zoom function this problem won't show up).

So I think my xScale and yScale domain may be defined incorrectly maybe the way
I load the data from the csv file.

*/


// The margins below define the margin object with properties for the four 
// sides (clockwise from the top). Here we set the margin object with the top 
// margin being 50, the right margin being 80, the bottom margin being 50 and 
// the left margin being 80. We then set the width and height as the inner 
// dimenstions of the chart area, that chart area being the margin object 
// defined previously.
var margin = {top: 50, right: 80, bottom: 50, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var colors = d3.scaleOrdinal(d3.schemeCategory10);

// This SVG section will include all the other SVG sections that will be 
// declared later on because of ".append("svg")". All the SVGs will be in the
// body of the webpage. This SVG also declares the attribute "width" by adding
// the left and right margins along with the width. It does the same with the
// "height" attribute but with the top and bottom margins. As stated before "g"
// groups SVG elements together. and the attribute "transform" will allow the
// the groups to begin at the top left corner of the webpage (with-in
// the margins).
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Below is the X and Y scale
// The scale is a function where you can pass input values into. The scaleTime
// encodes time along the x-axis. The scaleLinear creates a scale with a linear
// relationship between the input and output. The range for scaleLinear will 
// determine where the lines start from (the top or the bottom of the graph).
// Using d3.schemeCategory10 to define color scale.

// Need to redefine this later after loading data
var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);


// Define Tooltip here
var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);





// The X and Y AXIS are functions that set the characteristics of the x and y
// axis of the graph. The xAxis uses axisBottom which uses 'x' from before
// as a scale to space out the labels for each bar. axisBottom sets the axis at
// the bottom of the graph. For yAxis, it uses axisLeft, setting the axis to
// the left of the graph using the scale 'y' from before.
var xAxis = d3.axisBottom(xScale).ticks(16).tickPadding(2),
    yAxis = d3.axisLeft(yScale).tickPadding(2);


// scatterdata.csv contains the data needed to create the graph
// The columns are country, gdp, population, ecc, ec
d3.csv("scatterdata.csv").then(function(data) {
    
    // Sets scatterdataset to an array of size 5 with each entry being the country
    // name, country name, gdp, populatioin, epc, and tec
    var scatterdataset = data;
    scatterdataset.forEach(function(d) {
        d.name = d.country;
        d.gdp = +d.gdp;
        d.epc = +d.ecc;
        d.population = +d.population;
        d.tec = +d.ec;
        
    });
        
    
    //------------------Printing things to console-----------------------------
    
    console.log(scatterdataset); // this is an array of length 15  excluding the header
    console.log(data.map(function(c) {return c.gdp; })); //things from each column
    
    console.log(d3.min(data.map(function(c) {return c.gdp; })));
    console.log(d3.max(data.map(function(c) {return c.gdp; })));
    
    console.log(data.columns); // this is an array of length 7
    console.log(data.columns.slice(1)); // new array starting from 1st element
    console.log(data.columns.slice(1).map(function(dummy) {
                                                return dummy.toUpperCase();
                                          }));
    console.log(data.columns.slice(1).map(function(c) { return c } ));
    // creates a new array of length 15

    console.log(d3.extent(scatterdataset, function(d) { return d.gdp; }));
    console.log(d3.extent(scatterdataset, function(d) { return d.epc; } ));
    
    console.log([d3.min(scatterdataset, function(c) { return c.epc; }), d3.max(scatterdataset, function(c) { return c.epc; })]);
    console.log(scatterdataset[0].country); // epc for each country
    
    //-------------------------------------------------------------------------
    
    ///---------------Define domain for xScale and yScale----Scalable way------
    xScale.domain(d3.extent(scatterdataset, function(d) { return d.gdp; } ));
    yScale.domain(d3.extent(scatterdataset, function(d) { return d.epc; } ));
//        xScale.domain([0, 16]);
//        yScale.domain([0, 317]);
    
   ///--------Scale for area of circle----------
    // resource link: https://www.d3indepth.com/scales/
    var sqrtScale = d3.scaleSqrt().domain([0, d3.max(scatterdataset, function(d) {return d.ec;})]).range([0,45]);
    
    //Draw Scatterplot
    var view = svg.selectAll(".dot")
        .data(scatterdataset)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return sqrtScale(d.ec)})
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.epc);})
        .style("fill", function (d) { return colors(d.name); }) 
    //Add .on("mouseover", .....
        .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
    //Add Tooltip.html with transition and style
    // resource link: http://bl.ocks.org/weiglemc/6185069
          tooltip.html(
            "<table>"+
                "<tr><th colspan=\"3\">" + d["name"] + "</th></tr>" + 
                  "<tr><td class=\"left-column\">Population</td>" +
                        "<td> : </td>" +
                        "<td class=\"right-column\">" + d["population"] + 
                        " Million</td></tr>"+
                  "<tr><td class=\"left-column\">GDP</td>" +
                        "<td> : </td>" +
                        "<td class=\"right-column\">" + d["gdp"] + 
                        " Trillion</td></tr>"+
                  "<tr><td class=\"left-column\">EPC</td>" +
                        "<td> : </td>" +
                        "<td class=\"right-column\">" + d["epc"] + 
                        " Million BTUs</td></tr>"+
                  "<tr><td class=\"left-column\">Total</td>" +
                        "<td> : </td>" +
                        "<td class=\"right-column\">" + d["tec"] + 
                        " Trillion BTUs</td></tr>"+
            "</table>")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
          })
    //Then Add .on("mouseout", ....
          .on("mouseout", function(d) {
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0); //hidden
          });
    

    

    ///----------------------Draw country names & X-Y axis---------------------
    
    //Draw Country Names
    var names = svg.selectAll(".text")
        .data(scatterdataset)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc);})
        .style("fill", "black")
        .text(function (d) {return d.name; });

    //x-axis
    var gX = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        
    gX.append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#000")
        .text("GDP (in Trillion US Dollars) in 2010");

    
    //Y-axis
    var gY = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
        
    gY.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "#000")
        .text("Energy Consumption per Capita (in Million BTUs per person)");
    
    ///------------------------------Zoom--------------------------------------
    // resource link: https://bl.ocks.org/mbostock/db6b4335bf1662b413e7968910104f0f/e59ab9526e02ec7827aa7420b0f02f9bcf960c7d
    
    //Scale Changes as we Zoom
    var zoom = d3.zoom()
        .scaleExtent([0.5, 15])
        .translateExtent([[-100, -100], [width + 160, height + 125]])
        .on("zoom", zoomed);
    
    // Call the function d3.behavior.zoom to Add zoom
    svg.call(zoom);
    
    function zoomed() {
      view.attr("transform", d3.event.transform);
      names.attr("transform", d3.event.transform);
      gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
      gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
    }
    
    
    ///---------------------------LEGEND--------------------------------------
    
    // Append rectangle to SVG and position the legend box.
    svg.append("rect")
        .attr("x", width - 200)
        .attr("y", height - 180)
        .attr("width", 200)
        .attr("height", 170)
        .style("fill", "#ccc")
        .style("opacity", 0.5);
    
    // Add three circles and position them accordingly.
    var t = d3.scaleSqrt().domain([0, 100]).range([0,45]);
    svg.append("circle")
        .attr("cx", width - 60)
        .attr("cy", height - 165)
        .attr("r", t(1))
        .style("fill", "#fff")
        .style("opacity", 0.9);
    svg.append("circle")
        .attr("cx", width - 60)
        .attr("cy", height - 138)
        .attr("r", t(10))
        .style("fill", "#fff")
        .style("opacity", 0.9);
    svg.append("circle")
        .attr("cx", width - 60)
        .attr("cy", height - 70)
        .attr("r", t(100))
        .style("fill", "#fff")
        .style("opacity", 0.9);
   
    // Append text to denote the value of each circle size.
    svg.append("text")
        .attr("x", width - 183)
        .attr("y", height - 160)
        .attr("font-size", "12px")
        .style("fill", "#000")
        .text("1 Trillion BTUs");
    svg.append("text")
        .attr("x", width - 190)
        .attr("y", height - 135)
        .attr("font-size", "12px")
        .style("fill", "#000")
        .text("10 Trillion BTUs");
    svg.append("text")
        .attr("x", width - 198)
        .attr("y", height - 70)
        .attr("font-size", "12px")
        .style("fill", "#000")
        .text("100 Trillion BTUs");        
    
    // Append text to display the legend title.
    svg.append("text")
        .attr("x", width - 180)
        .attr("y", height - 15)
        .attr("font-size", "12px")
        .style("fill", "#0b0")
        .text("Total Energy Consumption");
    
    
    
});
