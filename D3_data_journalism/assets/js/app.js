// @TODO: YOUR CODE HERE!

// Define height and hegiht for the SVG area
let svgWidth = 1000;
let svgHeight = 500;

// Define margins for the chart object
let margin = {
  top: 20,
  right: 30,
  bottom: 100,
  left: 100
};
// chart area size definition

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;


// create the SVG

let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append SVG into group

let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial graph showed 
let chosedX = "poverty";
let chosedY = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(readData, chosedX) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(readData, d => d[chosedX]),
    d3.max(readData, d => d[chosedX])
  ])
  .range([0, width]);
  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(readData, chosedY) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(readData, d => d[chosedY]),
    d3.max(readData, d => d[chosedY])
  ])
  .range([height, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

// function used for updating circles group with a transition to new circles on changes on X axes
function renderCircles(circlesGroup, newXScale, chosedX) {
  // To move the circles
  circlesGroup.selectAll("circle").transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosedX]))
  // To move the text  
  circlesGroup.selectAll("text").transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosedX]))
    return circlesGroup;  
}

// function used for updating circles group with a transition to new circles on changes on Y axes
function renderYCircles(circlesGroup, newYScale, chosedY) {
  // To move the circles
  circlesGroup.selectAll("circle").transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosedY]));
  // To move the text
  circlesGroup.selectAll("text").transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosedY]));
  
    return circlesGroup;
}

// functions used for updating circles group with new tooltip on changes
function updateToolTip(chosedX, chosedY, circlesGroup) {
  var label;
  if (chosedX === "poverty"){
    label = "Poverty:";
  }else if (chosedX === "age") {
    label = "Age:";
  }else if (chosedX === "income"){
    label = "Household income:";
  }

  var ylabel;
  if (chosedY === "healthcare"){
    ylabel = "Healthcare:";
  }else if (chosedY === "obesity") {
    ylabel = "Obesity:";
  }else if (chosedY === "smokes"){
    ylabel = "Smokes:";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosedX]}<br>${ylabel} ${d[chosedY]}`);
    });
  
  circlesGroup.call(toolTip);
  // on mouseover event EVALUATE IF WE CAN CHANGE IT TO ARROW FUNCTION
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
  // on mouseout event
  .on("mouseout", function(data, index){
    toolTip.hide(data);
  });
  
  return circlesGroup;
} // end of function update ToolTip on changes

// Load data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(readData) {
console.log(readData);
// Parse data
readData.forEach(function(data) {
  data.poverty = +data.poverty;
  data.age = +data.age;
  data.income = +data.income;
  data.healthcare = +data.healthcare;
  data.obesity = +data.obesity;
  data.smokes = +data.smokes;
});

// XLinearScale function called (defined above csv import code)
var xLinearScale = xScale(readData, chosedX);
// console.log(xLinearScale);

// YLinearScale function called
var yLinearScale = yScale(readData, chosedY);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append x axis
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// Append y axis
var yAxis = chartGroup.append("g") //take care
  .classed("y-axis", true)
  .call(leftAxis);

// Append initial circles
var circlesGroup = chartGroup.selectAll("circle")
  .data(readData)
  .enter()
  .append("g")
  
  circlesGroup.append("circle")
  .attr("cx", d => xLinearScale(d[chosedX]))
  .attr("cy", d => yLinearScale(d[chosedY])) //(d.healthcare))
  .attr("r", 20)
  .attr("fill", "stateCircle") //from d3Style
  .attr("opacity", ".5")
  .attr("class", "stateCircle")

// This section of the code was suppose to add the text, but it does not work
  circlesGroup.append("text").text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chosedX]))
    .attr("y", d => yLinearScale(d[chosedY]))
    .attr ("font-size", 10)
    .attr("class", "stateText")
    // .attr("dx", 20 / 2)
    // .attr("dy", 20 / 2)
    // .text(d => d.abbr)

    // selectAll("text")
    // .data(readData)
    // .enter()
// Create group for three x-axis labels

var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);
// Creating the Three different types of x labels
var labelPoverty = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") //value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");

var labelAge = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "age") //value to grab for event listener
  .classed("inactive", true)
  .text("Age (Median)");  

var labelIncome = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") //value to grab for event listener
  .classed("inactive", true)
  .text("Household Income (Median)");

// Create group for three y-axis labels

var ylabelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)");
// Creating the Three different types of x labels
var labelHealthcare = ylabelsGroup.append("text")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height/2))
  .attr("dy", "1em")
  .attr("value", "healthcare") //value to grab for event listener
  // .classed("axis-text", true)
  .classed("active", true)
  .text("Lacks Healthcare (%)");  

var labelObese = ylabelsGroup.append("text")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height/2))
  .attr("dy", "2em")
  .attr("value", "obesity") //value to grab for event listener
  // .classed("axis-text", true)
  .classed("inactive", true)
  .text("Obese (%)");  

var labelSmokes = ylabelsGroup.append("text")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height/2))
  .attr("dy", "3em")
  .attr("value", "smokes") //value to grab for event listener
  // .classed("axis-text", true)
  .classed("inactive", true)
  .text("Smokes (%)");  

// updateToolTip function
var circlesGroup = updateToolTip(chosedX, chosedY, circlesGroup);

// x axis labels event listener
xlabelsGroup.selectAll("text")
  .on("click", function(){
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosedX) {
      // if chose x value different than current selection
      chosedX = value;
      console.log(chosedX);
      
      // update XLinearScale function
      xLinearScale = xScale(readData, chosedX);

      // update x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

      // update circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosedX);

      // update toolTip with new info
      circlesGroup = updateToolTip(chosedX, chosedY, circlesGroup);

      // changes classes to change bold text
      if (chosedX === "age") {
        labelAge.classed("active", true).classed("inactive", false);
        labelPoverty.classed("active", false).classed("inactive", true);
        labelIncome.classed("active", false).classed("inactive", true);
      } else if (chosedX === "poverty") {
        labelPoverty.classed("active", true).classed("inactive", false);
        labelAge.classed("active", false).classed("inactive", true);
        labelIncome.classed("active", false).classed("inactive", true);
      } else if (chosedX === "income") {
        labelIncome.classed("active", true).classed("inactive", false);
        labelAge.classed("active", false).classed("inactive", true);
        labelPoverty.classed("active", false).classed("inactive", true);
      }

    } // end if value !==chosedX
  }) // end event x listener .on("click")

// y axis labels event listener
ylabelsGroup.selectAll("text")
  .on("click", function(){
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosedY) {
      // if chose y value different than current selection
      chosedY = value;
      console.log(chosedY);
      
      // update YLinearScale function
      yLinearScale = yScale(readData, chosedY);

      // update x axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis); 

      // update circles with new x values
      circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosedY);

      // update toolTip with new info
      circlesGroup = updateToolTip(chosedX, chosedY ,circlesGroup);

      // changes classes to change bold text
      if (chosedY === "healthcare") {
        labelHealthcare.classed("active", true).classed("inactive", false);
        labelObese.classed("active", false).classed("inactive", true);
        labelSmokes.classed("active", false).classed("inactive", true);
      } else if (chosedY === "obesity") {
        labelObese.classed("active", true).classed("inactive", false);
        labelHealthcare.classed("active", false).classed("inactive", true);
        labelSmokes.classed("active", false).classed("inactive", true);
      } else if (chosedY === "smokes") {
        labelSmokes.classed("active", true).classed("inactive", false);
        labelHealthcare.classed("active", false).classed("inactive", true);
        labelObese.classed("active", false).classed("inactive", true);
      }

    } // end if value !==chosenyAxis
  }) // end event y listener .on("click")

}).catch(e => console.log(e));
