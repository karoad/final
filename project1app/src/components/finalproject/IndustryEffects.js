import React, { Component } from 'react';
import * as d3 from 'd3';

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
    var listCsv = ["final/data/TotalDiningEmployees.csv", "final/data/UnemploymentData.csv", "final/data/USAWEeklyAverageHours.csv"];
    var listPromises = []
    for (var i = 0; i < listCsv.length; i++){
      const promise = new Promise((resolve, reject) => {
          resolve(d3.csv(listCsv[i]).then(function(data){
            data.forEach(function(d) {
              d.Year = +d.Year; //Number Col
              d.Jan = d.Jan; //String Col
            });
          }));
      });
      listPromises.push(promise);
    }

    
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
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xscaleScatter));
    
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
    
    Promise.all(listPromises).then((values) => {
      totalEmployeesData = this.separateData(values[0]);
      totalEmployeesLine = this.createLineData(values[0]);
      unemploymentData = this.separateData(values[1]);
      unemploymentLine = this.createLineData(values[1]);
      avgWeeklyHours = this.separateData(values[2]);
      avgWeeklyHoursLine = this.createLineData(values[2]);
  
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
        
      
      this.updatePoints(totalEmployeesData, totalEmployeesLine, xscaleScatter, yscaleScatterTotalEmployees);
    });

    d3.select("#selectButton").on("change", function(d) {
      // recover the option that has been chosen
      var selectedOption = d3.select(this).property("value")
      // run the updateChart function with this selected option
      if (selectedOption == "Total Employees"){ yAxis.call(d3.axisLeft(yscaleScatterTotalEmployees)); IndustryEffects.updatePoints(totalEmployeesData, totalEmployeesLine, xscaleScatter, yscaleScatterTotalEmployees); }
      else if (selectedOption == "Unemployment") {yAxis.call(d3.axisLeft(yscaleScatterUnemployment)); IndustryEffects.updatePoints(unemploymentData, unemploymentLine, xscaleScatter, yscaleScatterUnemployment);}
      else { yAxis.call(d3.axisLeft(yscaleScatterHoursWorked)); IndustryEffects.updatePoints(avgWeeklyHours, avgWeeklyHoursLine, xscaleScatter, yscaleScatterHoursWorked);}
    }); // corresponding value returned by the button
  }

  updatePoints(data, line, xscaleScatter, yscaleScatter) {
    //data points
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
          return xscaleScatter(d[1]);
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
        lineData.push([xscaleScatter(currRow[j][0]), yscaleScatter(currRow[j][1])]);
      }
      var pathData = lineGenerator(lineData);
      scatterSvg.append("path")
      //.transition()
      //.duration(1000)
      .attr("d", pathData)
      .attr("stroke", "black")
      .attr("stroke", "gray")
      .attr("stroke-width", 3)
      .style("opacity", function(d){return 0.7;})
      .attr("fill", "none")
      .on('mouseover', function(mouseEvent, val) {
        //display datapoint info somewhere
        d3.select(this).attr('stroke-width', 7).attr('stroke', 'steelblue').style("opacity", function(d){return 1;});
      })
      .on('mouseout', function(mouseEvent, val) {
        //consider undoing the above  
        d3.select(this).attr('stroke-width', 3).attr('stroke', 'gray').style("opacity", function(d){return 0.7;});
      });
    }
  }

  separateData(dataIn) {
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

  createLineData(dataIn) {
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
    return listOfEverything;
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  render() {
    return <div class="industry">
              <h4>IndustryEffects Component</h4>
              <select id="selectButton"></select>
           </div>
  }
} 

export default IndustryEffects;