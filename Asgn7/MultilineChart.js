/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

// The margins below define the margin object with properties for the four 
// sides (clockwise from the top). Here we set the margin object with the top 
// margin being 10, the right margin being 40, the bottom margin being 150 and 
// the left margin being 50. We then set the width and height as the inner 
// dimenstions of the chart area, that chart area being the margin object 
// defined previously.
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


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


// Variable to parse the time of year
var parseYear = d3.timeParse("%Y");

// Below is the X and Y scale
// The scale is a function where you can pass input values into. The scaleTime
// encodes time along the x-axis. The scaleLinear creates a scale with a linear
// relationship between the input and output. The range for scaleLinear will 
// determine where the lines start from (the top or the bottom of the graph).
// Using d3.schemeCategory10 to define color scale.
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    color = d3.scaleOrdinal(d3.schemeCategory10);

// The X and Y AXIS are functions that set the characteristics of the x and y
// axis of the graph. The xAxis uses axisBottom which uses 'x' from before
// as a scale to space out the labels for each bar. axisBottom sets the axis at
// the bottom of the graph. For yAxis, it uses axisLeft, setting the axis to
// the left of the graph using the scale 'y' from before.
var xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);

// line is defined as a d3.line. This displays the line shape of the data with
// x axis as the year and y axis as the epc.
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.epc); });


// gridlines in x axis function
function gridXaxis() {		
    return d3.axisBottom(x).ticks(5)
}

// gridlines in y axis function
function gridYAxis() {		
    return d3.axisLeft(y).ticks(5)
}


// BRICSdata.csv contains the EPC data of 7 countries from years 2000-2014.
// The columns are year, Brazil, Russia, China, India, South Africa, USA.
d3.csv("BRICSdata.csv").then(function(data) {
    
    // This parses every year in the year column in the csv file.
    data.forEach(function(d) {
       d.year = parseYear(d.year)
    });
    
    // Sets countries to an array of size 6 with each entry being the country
    // name (id) and the corresponding epc for 15 years(values) for that 
    // country.
    var countries = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d) {
                return {year: +d.year, epc: +d[id]};
            })
        };
    });
    
    //------------------Printing things to console-----------------------------
    
    console.log(data); // this is an array of length 15  excluding the header
    console.log(data.columns); // this is an array of length 7
    console.log(data.length); // 15 
    console.log(data.columns.slice(1)); // new array starting from 1st element
    console.log(data.columns.slice(1).map(function(dummy) {
                                                return dummy.toUpperCase();
                                          }));
    console.log(data.columns.slice(1).map(function(c) { return c } ));
    // creates a new array of length 15
    console.log(data.map(function(dummy) { return dummy["Brazil"]; } )); 
    console.log(d3.extent(data, function(d) { return d.year; } ));
    console.log([
        d3.min(countries, function(c) { 
                            return d3.min(c.values, function(d) { 
                                return d.epc; 
                            }); 
                          }),
        d3.max(countries, function(c) { 
                            return d3.max(c.values, function(d) { 
                                return d.epc; 
                            }); 
                          })
    ]);
    console.log(countries); // epc for each country
    
    //-----------------------------------------------------------------
    
    // The scale's domain is the range of possible input data values. In this
    // case the range of possible input data values for the 'x' is all the
    // years(2000-2014). The range of possible input data values for the 'y'
    // is from the lowest to the greatest value of every possible EPC value.
    // color's domain is the number of countries chosen.
    x.domain(d3.extent(data, function(d) {return d.year;}));
    y.domain([
        d3.min(countries, function(c) { 
                            return d3.min(c.values, function(d) { 
                                return d.epc; 
                            }); 
                          }),
        d3.max(countries, function(c) { 
                            return d3.max(c.values, function(d) { 
                                return d.epc; 
                            }); 
                          })
    ]);
    color.domain(countries.map(function(c) {return c.id}));
    
    // add the X gridlines
    svg.append("g")			
       .attr("class", "grid")
       .attr("transform", "translate(0," + height + ")")
       .call(gridXaxis()
          .tickSize(-height)
          .tickFormat("")
            )

    // add the Y gridlines
    svg.append("g")			
       .attr("class", "grid")
       .call(gridYAxis()
          .tickSize(-width)
          .tickFormat("")
            )
    
    // Creating x-axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Creating y-axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "translate("+ (-50) +","+(height/2 - 60)+")rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("fill", "#000")
      .text("EPC");

    
    // Creates country as a class that uses countries dataset
    var country = svg.selectAll(".country")
      .data(countries)
      .enter().append("g")
      .attr("class", "country");
    
    // For each path, the line is set with the country variable with the stroke
    // of each line being a different color by using the variable color I
    // declared before to dynamically choose the color of the path. The lines
    // will use data of values in country to graph the line.
    var path = svg.selectAll(".country").append("path")
      .attr("class","line")
      .attr("d", function(d) { return line(d.values); })
      .attr("stroke", function(d) { return color(d.id); });

    var totalLength = path.node().getTotalLength(); // getting length of path

    // This graphs the line for each country and gives each line the transition
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition() // Call Transition Method
            .duration(4000) // Set Duration timing (ms)
            .ease(d3.easeLinear) // Set Easing option
            .attr("stroke-dashoffset", 0); // Set final value of dash-offs

    // This section of code adds the name of the country at the end of the line in the graph
    country.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.epc) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
    
   
});
