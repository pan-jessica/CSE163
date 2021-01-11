/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3*/

/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/

// Search "D3 Margin Convention" on Google to understand margins.
// The margins below define the margin object with properties for the four 
// sides (clockwise from the top). Here we set the margin object with the top 
// margin being 10, the right margin being 40, the bottom margin being 150 and 
// the left margin being 50. We then set the width and height as the inner 
// dimenstions of the chart area, that chart area being the margin object 
// defined previously.

var margin = {top: 10, right: 40, bottom: 150, left: 50},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

// Define SVG. "g" means group SVG elements together. 
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

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/

// Define X and Y SCALE.
// The scale is a function where you can pass input values into. The scaleBand
// is used to determine the horizontal positions of the bars, each bar would
// have a set width and the padding of 0.1 in between each bar. The scaleLinear
// creates a scale with a linear relationship between the input and output. The
// range for scaleLinear will determine where the bars start from (the top or
// the bottom of the graph).
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);

var yScale = d3.scaleLinear().range([height, 0]);

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign
// The X and Y AXIS are functions that set the characteristics of the x and y
// axis of the graph. The xAxis uses axisBottom which uses xScale from before
// as a scale to space out the labels for each bar. axisBottom sets the axis at
// the bottom of the graph. For yAxis, it uses axisLeft, setting the axis to
// the left of the graph using the scale 'yScale' from before.

// Tick marks on the y-axis are the marks at the y-axis. We can set a tick mark
// at every interval of 5. For each tick mark to have a '$' in front we will do
// the following '.ticks(5, "$")'
var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft().scale(yScale).ticks(5, "$");


/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/

// data.csv contains the country name(key) and its GDP(value)
// d.key and d.value are very important commands
// You must provide comments here to demonstrate your understanding of these commands
// The rowConverter function will map every pair in the csv file to the
// key and value. Since the name of each pair in the csv file is
// (country, gdp) we will change it to key as country name and value as the gdp

function rowConverter(data) {
    return {
        key : data.country,
        value : +data.gdp
    };
}

d3.csv("GDP2020TrillionUSDollars.csv", rowConverter).then(function (data) {
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    // The scale's domain is the range of possible input data values. In this
    // case the range of possible input data values for the xScale is all the
    // countrys' names. The range of possible input data values for the yScale
    // is from 0 to the greatest value for gdp.
    xScale.domain(data.map(function (d) { return d.key; }));
    yScale.domain([0, d3.max(data, function (d) {return d.value; })]);
    
    // Creating rectangular bars to represent the data. 
    // This svg creates the rectangular bars in the bar graph. Each bar will
    // have a transition of moving into the webpage with '.delay' This will
    // delay each bar by 200 after the previous bar. Then the x and y of the
    // graph will have xScale and yScale. The height of each bar will be the
    // height of it's d.value.
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .transition().duration(1000)
        .delay(function (d, i) {return i * 200; })
        .attr("x", function (d) {
            return xScale(d.key);
        })
        .attr("y", function (d) {
            return yScale(d.value);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
			return height - yScale(d.value);
        })
        
        // create increasing to decreasing shade of blue as shown on the output
        // This will create a gradiance in the shades of blue as we move down
        // the x-axis by returning rbg(0,0,?)
        .attr("fill", function (d) {
            return "rgb(0, 0, " + Math.round(d.value * 100) + ")";
        });


    // Label the data values(d.value)
    // This will create the labels at the top of each bar. It'll show the
    // d.value of each bar in white text with the font-family of sans-serif
    // and with the font size of 11.
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) {
            return d.value;
        })
        .attr("x", function (d, i) {
            return i * (width / data.length) + 10;
        })
        .attr("y", function (d) {
            return yScale(d.value) + 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");

    
    // Draw xAxis and position the label at -60 degrees as shown on the output
    // This svg will draw the xAxis of the graph and the position of the label
    // of each for each bar. I've added the last line in this svg to rotate the
    // labels by -60 degrees by using the transform attribute.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("transform", "rotate(-60)");
        
    
    // Draw yAxis and position the label
    // This svg will draw the yAxis and the positions of each label. The labels
    // will automatically display with an interval of 5 because we already
    // declared it before creating this svg.
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis);
    
    // Adding y-axis caption "Trillions of US Dollars": This caption will be
    // a text that'll be anchored in the middle of the y-axis and rotated -90
    // degrees to be displayed properly. The caption will also be within the
    // margin space.
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -margin.bottom)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .text("Trillions of US Dollars");
      
});
