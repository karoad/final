import React, { Component } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

class Project3ExperimentViz extends Component {

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
    this.loadDataAndCalcStatistics(w, h);

  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  loadDataAndCalcStatistics(w, h) {
    var data;
    axios({
        url: 'https://karoad-psite-api.herokuapp.com/api/cs4802/project3/currentdatacsv',
        method: 'GET',
        responseType: 'text', // Important
      }).then((response) => {
        //console.log(response.data);

        data = d3.csvParse(response.data.substring(7));

           //console.log(data);
      var bubbleData = [];
      var gradientData = [];
      var barData = [];
      for (var i = 0; i < data.length; i++) {
        switch(data[i]["Viztype:"]) {
          case "GradientGraph":
            gradientData.push(data[i]);
            break;
          case "BarGraph":
            barData.push(data[i]);
            break;
          case "BubbleChart":
            bubbleData.push(data[i]);
            break;
          default:
            console.log(data[i]);
            break;
        }
      }
      var bubbleErrorUnscaled;
      var gradientErrorUnscaled;
      var barErrorUnscaled;


      var listOfErrors = [bubbleErrorUnscaled, gradientErrorUnscaled, barErrorUnscaled];
      var listOfLists = [bubbleData, gradientData, barData];
      
      //errors
      for(var i = 0; i < listOfLists.length; i++) {
        var currList = listOfLists[i];
        var runningErrorTotal = 0;
        for (var j = 0; j < currList.length; j++) {
          runningErrorTotal += Math.log2(Math.abs(currList[j]["Reported Percentage"] - currList[j]["True Percentage"])+(1/8));
        }
        listOfErrors[i]  = runningErrorTotal / currList.length;
      }

      //standard error / mean calculation

      
      var bubbleBootstrap = [];
      var gradientBootstrap = [];
      var barBootstrap = [];
      var listOfBootstrapErrors = [bubbleBootstrap, gradientBootstrap, barBootstrap];

      //bootstrap (uncomment for calculation)
      for(var i = 0; i < listOfLists.length; i++) {
        var currList = listOfLists[i];
        var currentBootstrap = [];
        for (var k = 0; k < currList.length; k++) {
          //do a bootstrap for each piece of data
          var runningErrorTotal = 0;
          for (var j = 0; j < currList.length; j++) {
            var randomInd = Math.floor(Math.random()* currList.length);
            runningErrorTotal += Math.log2(Math.abs(currList[randomInd]["Reported Percentage"] - currList[randomInd]["True Percentage"])+(1/8));
          }
          currentBootstrap.push(runningErrorTotal/currList.length);
        }
        currentBootstrap.sort();
        listOfBootstrapErrors[i][0] = currentBootstrap[Math.floor(currList.length/100*2.5)];
        listOfBootstrapErrors[i][1] = currentBootstrap[Math.floor(currList.length/100*97.5)];
        //listOfErrors[i]  = runningErrorTotal / currList.length;
      }

      var svg = d3.select(this.myRef.current).append("svg").style("background-color", "white");
      var width = 200;
      var height = 200;
      var margin = {top: 20, right: 40, bottom: 30, left: 40};
      var chartWidth = width - margin.left - margin.right;
      var chartHeight = height - margin.top - margin.bottom;
      svg.attr('width', width).attr('height', height);
      
      var g = svg.append('g');

      //  [Value, lower bound, upper bound] 
      // 1: Bubble 2: Gradient 3: Bar
      var toRet = []
      for (var i = 0; i < 3; i++) {
        toRet.push([listOfErrors[i], listOfBootstrapErrors[i][0], listOfBootstrapErrors[i][1]]);
      }
      
      var y = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, 2.5]);
      var yAxis = g.append('g')
        .attr('transform', 'translate('+margin.right+', 0)')
        .call(d3.axisLeft(y));
      
      var experiments = ["Bubble Plot", "Gradient", "Bar Chart", ];
      var xScale = d3.scalePoint()
        .range([5,chartWidth-15])
        .domain(experiments.map(function(d){
          return d;
        }));        
      var xAxis = d3.axisBottom(xScale)
        .tickFormat(function(d){
          return d;
        });
      xAxis = svg.append("g")
        .attr('transform', 'translate('+(margin.right+5)+',' + chartHeight + ')')
        .call(xAxis);

      var lineVar = d3.line()
      var pointsA = [
        [50, y((toRet[0][1]))],
        [50, y((toRet[0][2]))]
      ]
      var pointsB = [
        [100, y((toRet[1][1]))],
        [100, y((toRet[1][2]))]
      ]
      var pointsC = [
        [150, y((toRet[2][1]))],
        [150, y((toRet[2][2]))]
      ]

      svg.append('path')
      .attr('d', lineVar(pointsA))
      .attr("stroke", "#000000");

      svg.append('path')
      .attr('d', lineVar(pointsB))
      .attr("stroke", "#000000");

      svg.append('path')
      .attr('d', lineVar(pointsC))
      .attr("stroke", "#000000");

      svg.selectAll("circle")
      .data(toRet)
      .enter().append("circle")
      .attr('cy', function(d){return y(d[0])})
      .attr('cx', function(d, i){return (i+1)*50})
      .attr('r', '1.5%')

      return toRet;

    });
  }

  render() {
    return <div>
              <h3>Plotted Results</h3>
              <div className="circleDiv" ref={this.myRef}></div>  
           </div>
  }
} 

export default Project3ExperimentViz;