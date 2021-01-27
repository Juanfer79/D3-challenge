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

// function used for updating x-scale
function xScale(sourceData, chosedX) {
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(sourceData, d => d[chosedX]),
    d3.max(sourceData, d => d[chosedX])
  ])
  .range([0, width]);
  return xLinearScale;
}

  // function used for updating y-scale
  function yScale(sourceData, chosedY) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(sourceData, d => d[chosedY]),
    d3.max(sourceData, d => d[chosedY])])
  .range([height, 0]);
  return yLinearScale;
}

// function used for updating xAxis clicking on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// function used for updating yAxis clicking on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

// function for updating circles with changes on X Axis

function renderCircles(circlesGroup, newXScale, chosedX) {
  
  circlesGroup.selectAll("circle").transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosedX]))
    
  circlesGroup.selectAll("text").transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosedX]))
    
    return circlesGroup;  
}

// function used for updating circles group 
function renderYCircles(circlesGroup, newYScale, chosedY) {
  
  circlesGroup.selectAll("circle").transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosedY]));
  
  circlesGroup.selectAll("text").transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosedY]));
  
    return circlesGroup;
}

// functions used for updating circles group with new tooltip on changes
function updateToolTip(chosedX, chosedY, circlesGroup) {
  let label;
  if (chosedX === "poverty"){
    label = "Poverty:";
  }else if (chosedX === "age") {
    label = "Age:";
  }else if (chosedX === "income"){
    label = "Household income:";
  }

  let ylabel;
  if (chosedY === "healthcare"){
    ylabel = "Healthcare:";
  }else if (chosedY === "obesity") {
    ylabel = "Obesity:";
  }else if (chosedY === "smokes"){
    ylabel = "Smokes:";
  }

  let toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosedX]}<br>${ylabel} ${d[chosedY]}`);
    });
  
  circlesGroup.call(toolTip);
  
  // analyze mousever
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
  // on mouseout event
  .on("mouseout", function(data, index){
    toolTip.hide(data);
  });
  
  return circlesGroup;
} 

// CSV data loading
d3.csv("./static/data/data.csv").then(function(sourceData) {
console.log(sourceData);
// Parse data
sourceData.forEach(function(data) {
  data.poverty = +data.poverty;
  data.age = +data.age;
  data.income = +data.income;
  data.healthcare = +data.healthcare;
  data.obesity = +data.obesity;
  data.smokes = +data.smokes;
});

// calling x and Y linear function
let xLinearScale = xScale(sourceData, chosedX);
let yLinearScale = yScale(sourceData, chosedY);

// Create initial axis functions
let bottomAxis = d3.axisBottom(xLinearScale);
let leftAxis = d3.axisLeft(yLinearScale);

// append x axis
let xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append y axis
let yAxis = chartGroup.append("g") //take care
  .classed("y-axis", true)
  .call(leftAxis);

// Append initial circles
var circlesGroup = chartGroup.selectAll("circle")
  .data(sourceData)
  .enter()
  .append("g")
  
  circlesGroup.append("circle")
  .attr("cx", d => xLinearScale(d[chosedX]))
  .attr("cy", d => yLinearScale(d[chosedY])) 
  .attr("r", 20)
  .attr("fill", "stateCircle")
  .attr("opacity", ".5")
  .attr("class", "stateCircle")


  circlesGroup.append("text").text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chosedX]))
    .attr("y", d => yLinearScale(d[chosedY]))
    .attr ("font-size", 15)
    .attr("class", "stateText")
    

let xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

  // Creating  x labels

  var labelPoverty = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") 
  .classed("active", true)
  .text("In Poverty (%)");

let labelAge = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "age") 
  .classed("inactive", true)
  .text("Age (Median)");  

let labelIncome = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") 
  .classed("inactive", true)
  .text("Household Income (Median)");

// Creating Y labels

let ylabelsGroup = chartGroup.append("g")
  .attr("transform", "rotate(-90)");

  let labelHealthcare = ylabelsGroup.append("text")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height/2))
  .attr("dy", "1em")
  .attr("value", "healthcare") 
  .classed("active", true)
  .text("Lacks Healthcare (%)");  

let labelObese = ylabelsGroup.append("text")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height/2))
  .attr("dy", "2em")
  .attr("value", "obesity") 
  .classed("inactive", true)
  .text("Obese (%)");  

let labelSmokes = ylabelsGroup.append("text")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height/2))
  .attr("dy", "3em")
  .attr("value", "smokes") 
  .classed("inactive", true)
  .text("Smokes (%)");  

// update ToolTip 
circlesGroup = updateToolTip(chosedX, chosedY, circlesGroup);

// x axis labels event listener
xlabelsGroup.selectAll("text")
  .on("click", function(){
    // selected value
    let value = d3.select(this).attr("value");
    if (value !== chosedX) {
      
      chosedX = value;
      console.log(chosedX);
      
      xLinearScale = xScale(sourceData, chosedX);
      xAxis = renderAxes(xLinearScale, xAxis);
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosedX);
      circlesGroup = updateToolTip(chosedX, chosedY, circlesGroup);

      // change text when selection is made
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

    } 
  }) 

// y axis labels event listener
ylabelsGroup.selectAll("text")
  .on("click", function(){
    
    // get value of selection
    let value = d3.select(this).attr("value");
    if (value !== chosedY) {
      
      chosedY = value;
      console.log(chosedY);
      
      //updates
      yLinearScale = yScale(sourceData, chosedY);
      yAxis = renderYAxes(yLinearScale, yAxis); 
      circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosedY);
      circlesGroup = updateToolTip(chosedX, chosedY ,circlesGroup);

      // change text when selection is made
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

    } 
  }) 
}).catch(function(error) {
  console.log(error);
});
