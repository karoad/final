import React, { Component } from 'react';
import * as d3 from 'd3';

let updatePoints = (data, line, xscaleScatter, yscaleScatter) => {
  
  //data points
  var margin = {top: 10, right: 30, bottom: 30, left: 60};
  var scatterSvg = d3.select("#scatterPlot");
  scatterSvg.selectAll("circle").remove();
  scatterSvg
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("id", function(d,i) { return "scatter"+ d[4]})
    .attr('cx', function(d, i){ 
        //depends on the month
        return xscaleScatter(d[1]) + margin.left;
    })
    .attr('cy', function(d){
        //depends on the actual val
        return yscaleScatter(d[2]);
    })
    .attr("r", 3)
    .style("fill", "#FFFFFF")
    .style("opacity", function(d){return 1;})
    .attr("stroke", "black")
    .attr("stroke-width", function(d){
        return 1;
    })
    .on('mouseover', function(mouseEvent, val) {
        //display datapoint info somewhere
        d3.select(this).attr('stroke-width', 2).attr('stroke', 'black');
    })
    .on('mouseout', function(mouseEvent, val) {
      //consider undoing the above  
      d3.select(this).attr('stroke-width', 1).attr('stroke', 'black');
  });

  scatterSvg.selectAll("path").remove();
  //credit https://www.d3-graph-gallery.com/graph/line_basic.html
  for (var i = 0; i < line.length; i++) {
    var lineGenerator = d3.line();
    var lineData = []
    var currRow =  line[i][1];
    var currYear = line[i][0];
    for (var j = 0; j < line[i][1].length; j++) {
      lineData.push([xscaleScatter(currRow[j][0])+margin.left, yscaleScatter(currRow[j][1])]);
    }
    var pathData = lineGenerator(lineData);
    scatterSvg.append("path")
    //.transition()
    //.duration(1000)
    .attr("d", pathData)
    .attr("stroke", "black")
    .attr("stroke", "gray")
    .attr("stroke-width", 3)
    .attr("yearSet", currYear)
        .style("opacity", function(d){return 0.7;})
        .attr("fill", "none")
        .on('mouseover', function(mouseEvent, val) {
          //display datapoint info somewhere
          d3.select(this).attr('stroke-width', 7).attr('stroke', '#a5c9bd').style("opacity", function(d){return 1;});
          d3.select("#yearText").text(d3.select(this).attr("yearSet"));
        })
    .on('mouseout', function(mouseEvent, val) {
      //consider undoing the above  
      d3.select(this).attr('stroke-width', 3).attr('stroke', 'gray').style("opacity", function(d){return 0.7;});
    });
  }
}

let separateData = (dataIn) =>{
  //function separates the data in format:
  //Each row is a year
  //each col is a month
  //each cell is a val
  //and changes it into:
  //everything is one row
  //each index is [year, month, val]
  var listOfEverything = [];
    for (var i = 0; i < dataIn.length; i ++) {
      var year = dataIn[i]["Year"];
      var count = 1;
      for (var key in dataIn[i]) {
        if (parseInt(dataIn[i][key]) != NaN && dataIn[i][key] != "" && key != "Year") {
          listOfEverything.push([year, count, parseInt(dataIn[i][key])]);
          count += 1;
        }
      }
    }
    return listOfEverything;
}

let createLineData = (dataIn) => {
  //function separates the data in format:
  //Each row is a year
  //each col is a month
  //each cell is a val
  //and changes it into:
  //each year is a row
  //each index is [month, val]
  var listOfEverything = [];
  for (var i = 0; i < dataIn.length; i ++) {
    var year = dataIn[i]["Year"];
    var listYear = [];
    var count = 1;
    for (var key in dataIn[i]) {
      if (parseInt(dataIn[i][key]) != NaN && dataIn[i][key] != "" && key != "Year") {
        listYear.push([count, parseInt(dataIn[i][key])]);
        count += 1;
      }
    }
    listOfEverything.push([year, listYear]);
  }
  //console.log(listOfEverything)
  return listOfEverything;
}

class IndustryEffects extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { windowWidth: window.innerWidth,
                   windowHeight: window.innerHeight };
  }

  handleResize = (e) => {
    this.setState({ windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight});
  };


  componentDidMount() {
    //Responsive Sizing
    window.addEventListener("resize", this.handleResize);
    let { windowWidth, windowHeight } = this.state; 
    let w = windowWidth / 2;
    let h = windowHeight / 2; 
    //Create Background Region
    //Access D3 this way, use width and height to size dynamically
    // let accessToRef = d3.select(this.myRef.current).append("svg").append("circle")
    // d3.select(this.myRef.current).selectAll("circle")
    // .attr("r", function() { return h/6 })
    // .attr("fill", "red")
    // .attr('transform', 'translate(' + w/4+ ',' + h/6  + ')');
    var totalEmployeesText = "The drop in employees in 2020 was dramatic in the restaurant service industry: the number of workers was cut in half from 1/20-4/20.\n The total employees axis is in thousands of employees.";
    var unemploymentText = "The increase in unemployment was sharp in the 2020 pandemic";
    var totalHoursWorkedText = "Surprisingly, the total number of hours worked did not change much over the course of 2020. \n This means that the workers who stayed employed  were relatively uneffected for their work";
    
    var yearText = d3.select(".industry").append("div")
      .attr("width", 80)
      .attr("height", 40)
      .attr("padding-top", "5px;")
      .attr("padding-bottom", "5px;")
        .append("text")
        .attr("x", 0)
        .attr("y", 0)  
        .attr("id", "yearText")
        .text("Select a year");

    var margin = {top: 10, right: 30, bottom: 30, left: 60};
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;
    //setup body area and axis
    var scatterSvg = d3.select(".industry").append("svg")
    .attr("id", "scatterPlot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    var xscaleScatter = d3.scaleLinear()
    .domain([1, 12])
    .range([0, width]);

    var xAxis = scatterSvg.append("g")
    .attr("transform", "translate("+0+"," + height + ")")
    .call(d3.axisBottom(xscaleScatter));

    var summary = d3.select(".industry").append("div")
      .attr("width", width)
      .attr("height", height)
      .attr("padding-top", "5px;")
      .attr("padding-bottom", "5px;")
        .append("text")
        .attr("x", 0)
        .attr("y", 0)  
        .attr("id", "summaryText")
        .text(totalEmployeesText);
    
    var yscaleScatterTotalEmployees = d3.scaleLinear()
        .domain([6000,13000])
        .range([height, 0]);
    
    var yscaleScatterUnemployment = d3.scaleLinear()
      .domain([1, 35])
      .range([height, 0]);
    
    var yscaleScatterHoursWorked = d3.scaleLinear()
      .domain([20, 27])
      .range([height, 0]);
    var yAxis = scatterSvg.append("g")
    .call(d3.axisLeft(yscaleScatterTotalEmployees));

    var totalEmployeesData;
    var totalEmployeesLine;
    var unemploymentData;
    var unemploymentLine;
    var avgWeeklyHours;
    var avgWeeklyHoursLine;

    d3.csv("data/TotalDiningEmployees.csv").then(function(data) {
      totalEmployeesData = separateData(data);
      totalEmployeesLine = createLineData(data);
   
    d3.csv("data/UnemploymentData.csv").then(function(data) {
      unemploymentData = separateData(data);
      unemploymentLine = createLineData(data);
    
    d3.csv("data/USAWEeklyAverageHours.csv").then(function(data) {
      avgWeeklyHours = separateData(data);
      avgWeeklyHoursLine = createLineData(data);
    

      //console.log(totalEmployeesData);
      //console.log(totalEmployeesLine);
      //console.log(unemploymentData);
      //console.log(avgWeeklyHours);
  
      //console.log(totalEmployeesData.columns);
  
      //idea: line chart that is highlightable on mouseover, 
      //overlaid years selectable by years
      //also points that bring up the value and maybe a tooltip with a comment?
  
      //example 1: Total Employees data
      //start with the data points, should be all overlaid
      
  
      var allGroup = ["Total Employees", "Unemployment", "Average Weekly Hours"];
  
      // add the options to the button
      d3.select("#selectButton")
        .selectAll('myOptions')
          .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; });
        
      
      updatePoints(totalEmployeesData, totalEmployeesLine, xscaleScatter, yscaleScatterTotalEmployees, totalEmployeesText);

    d3.select("#selectButton").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      // run the updateChart function with this selected option
      if (selectedOption == "Total Employees"){
         yAxis.call(d3.axisLeft(yscaleScatterTotalEmployees));
         updatePoints(totalEmployeesData, totalEmployeesLine, xscaleScatter, yscaleScatterTotalEmployees);
         d3.select("#summaryText").text(totalEmployeesText); }
      else if (selectedOption == "Unemployment") {
        yAxis.call(d3.axisLeft(yscaleScatterUnemployment)); 
        updatePoints(unemploymentData, unemploymentLine, xscaleScatter, yscaleScatterUnemployment);
        d3.select("#summaryText").text(unemploymentText); }
      else { 
        yAxis.call(d3.axisLeft(yscaleScatterHoursWorked)); 
        updatePoints(avgWeeklyHours, avgWeeklyHoursLine, xscaleScatter, yscaleScatterHoursWorked);
        d3.select("#summaryText").text(totalHoursWorkedText); 
      }}); // corresponding value returned by the button
    });
   });
  });
  
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  render() {
    return <div className="industry">
              <select id="selectButton"></select>
           </div>
  }
} 

export default IndustryEffects;