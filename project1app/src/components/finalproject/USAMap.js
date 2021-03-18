import React, { Component } from 'react';
import * as d3 from 'd3';

// Recolors map
let updateMap = (date) => {
  d3.csv("data/reopened_seated_diner_data.csv").then(function(seatData) {
    d3.json("data/us-states.json").then(states=> {
      seatData.forEach(seats => {
        d3.select("#"+seats["Name"])
        .style("fill", function(){
          var color = d3.scaleLinear().domain([0,100]).range(["rgb(213,222,217)", "#11C411"]);
          let colorC = "rgb(213,222,217)";
          console.log(seats["Name"]);
          console.log(seats[date]);
          if(seats[date] == 'undefined'){
            return colorC;
          }else{
            console.log(seats[date]);
            colorC = color(seats[date]);
            return colorC;
          }
        })
      })
    });
  });
}

class USAMap extends Component {

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
    let h = windowHeight / 1.7; 

    var projection = d3.geoAlbersUsa()
      .translate([w/2, h/2])    // translate to center of screen
      .scale([900]);          // scale things down so see entire US

    var svg = d3.select(this.myRef.current)
			.append("svg")
			.attr("width", w)
			.attr("height", h);

    var path = d3.geoPath()
      .projection(projection);

    var date = "MAY12020";
    var optionDates = [
      "May 1st, 2020",
      "June 1st, 2020",
      "July 1st, 2020",
      "August 1st, 2020", 
      "September 1st, 2020",
      "October 1st, 2020",
      "November 1st, 2020", 
      "December 1st, 2020", 
      "January 1st, 2021", 
      "February 1st, 2021", 
      "March 1st, 2021",
      "March 2nd, 2021",
      "March 3rd, 2021",
      "March 4th, 2021",
      "March 5th, 2021",
      "March 6th, 2021",
      "March 7th, 2021",
      "March 8th, 2021",
      "March 9th, 2021",
      "March 10th, 2021",
      "March 11th, 2021",
      "March 12th, 2021",
      "March 13th, 2021",
      "March 14th, 2021",
      "March 15th, 2021",
      "March 16th, 2021", 
    ];
    var options = {
      "May 1st, 2020": "MAY12020",
      "June 1st, 2020": "JUN12020",
      "July 1st, 2020": "JUL12020",
      "August 1st, 2020": "AUG12020",
      "September 1st, 2020": "SEP12020", 
      "October 1st, 2020": "OCT12020",
      "November 1st, 2020": "NOV12020",
      "December 1st, 2020": "DEC12020",
      "January 1st, 2021": "JAN12021",
      "February 1st, 2021": "FEB12021",
      "March 1st, 2021": "MAR12021",
      "March 2nd, 2021": "MAR22021",
      "March 3rd, 2021": "MAR32021",
      "March 4th, 2021": "MAR42021",
      "March 5th, 2021": "MAR52021",
      "March 6th, 2021": "MAR62021",
      "March 7th, 2021": "MAR72021",
      "March 8th, 2021": "MAR82021",
      "March 9th, 2021": "MAR92021",
      "March 10th, 2021": "MAR102021",
      "March 11th, 2021": "MAR112021",
      "March 12th, 2021": "MAR122021",
      "March 13th, 2021": "MAR132021",
      "March 14th, 2021": "MAR142021",
      "March 15th, 2021": "MAR152021",
      "March 16th, 2021": "MAR162021"
    }

    d3.select("#mapButton")
      .selectAll("myOptions")
        .data(optionDates)
        .enter()
        .append('option')
        .text(function(d) { return d;})
        .attr("value", function (d) {return options[d];});

    d3.select("#mapButton").on("change", function() {
      // recover the option that has been chosen
      date = d3.select(this).property("value");
      console.log(date);
      updateMap(date);
    });

    d3.csv("data/reopened_seated_diner_data.csv").then(function(seatData) {
      var color = d3.scaleLinear().domain([0,100]).range(["rgb(213,222,217)", "#11C411"]);
      d3.json("data/us-states.json").then(states=> {
        svg.selectAll("path")
          .data(states.features)
          .enter()
          .append("path")
          .attr("id", function(d) { return d.properties.name;})
          .attr("d", path)
          .style("stroke", "grey")
          .style("fill", function(d) {
            let colorC = "rgb(213,222,217)";
            seatData.forEach(function(seats) {
              if(seats["Name"] === d.properties.name){
                colorC = color(seats[date]);
              }
            })
            return colorC;
          })
      });
    });

    // creating map legend
    var data = [{"color":"#d5ded9", "value": 0}, {"color":"#A4D8A7", "value": 25}, {"color":"#73D175", "value": 50}, {"color":"#42CB43", "value": 75}, {"color":"#11C411", "value": 100}];
    var extent = d3.extent(data, d => d.value);
    var padding = 25;
    var width = 320;
    var innerWidth = width - (padding * 2);
    var barHeight = 8;
    var height = 28;
    var xScale = d3.scaleLinear()
    .range([0, innerWidth])
    .domain(extent);
    var xTicks = data.filter(f => f.value % 25 === 0).map(d => d.value);
    var xAxis = d3.axisBottom(xScale)
        .tickSize(barHeight * 2)
        .tickValues(xTicks);
    var legend = d3.select("#legend").attr("width", width).attr("height", height);
    var g = legend.append("g").attr("transform", "translate(" + padding + ", 0)");
    var defs = legend.append("defs");
    var linearGradient = defs.append("linearGradient").attr("id", "myGradient");
    linearGradient.selectAll("stop")
        .data(data)
      .enter().append("stop")
        .attr("offset", d => ((d.value - extent[0]) / (extent[1] - extent[0]) * 100) + "%")
        .attr("stop-color", d => d.color);
    g.append("rect")
      .attr("width", innerWidth)
      .attr("height", barHeight)
      .style("fill", "url(#myGradient)");

    g.append("g")
      .call(xAxis)
      .select(".domain").remove();
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  render() {
    return <div>
              <h5>Visualizes <a href="https://www.opentable.com/state-of-industry">Open Tables</a> similarly named dataset which captures the percent in 
              which resturaunts in a given state are able to reopen with similar reservation performance with 2019 as a baseline. The higher the percentage the better resturaunts are performing as they were relatively prior to the COVID-19 pandemic. This study only covers the states of California,
              Florida, Illinois, Massachusetts, New Jersey, Pennsylvania, and Texas. Below you can select dates starting on May 1st, 2020 and up to March 16th, 2021 from the drop down menu.</h5>
              <div className="mapUSA" ref={this.myRef}></div>
              <div className="USALB">
                <select id="mapButton"></select>
                <svg id="legend"></svg>
              </div>
              <div>
              
              </div>  
           </div>
  }
} 

export default USAMap;