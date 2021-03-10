import React, { Component } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";


class DatabaseExample extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      participantID: 0,
      trialNum: 0,
      viz: "Default",
      truePercent: 0,
      reportedPercent: 0,
      currentTrialData: [],
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      trialIndexA: 0,
      trialIndexB: 0,
      graphTrial: 0,
      data: [],
      nextpage: 0,
    };

    this.handleReportedPercentChange = this.handleReportedPercentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.randomGradient = this.randomGradient.bind(this);
    this.generateData = this.generateData.bind(this);
    this.generateIndexes = this.generateIndexes.bind(this);
    this.randomBarGraph = this.randomBarGraph.bind(this);
    this.randomBubbleChart = this.randomBubbleChart.bind(this);
    this.generateData()
    this.loadData()
  }

  handleResize = (e) => {
    this.state.windowWidth = window.innerWidth;
    this.state.windowHeight = window.innerHeight;
  };

  loadData(){
    //Responsive Sizing
    axios.get('https://karoad-psite-api.herokuapp.com/api/cs4802/project3/presonses') 
    .then(res => {
        this.state.currentTrialData = res.data.results;
        this.state.participantID = res.data.length;
    });
    
  }

  componentDidMount() {
    var svg = d3.select(this.myRef.current).append("svg").style("background-color", "white");

    if(this.state.graphTrial % 3 === 0){
      this.randomBarGraph(svg);
    }else if(this.state.graphTrial % 3 === 1){
      this.randomBubbleChart(svg);
    }else{
      this.randomGradient(svg);
    }
  }

  handleReportedPercentChange(event) {
    this.setState({reportedPercent: event.target.value});
  }

  //generate the data points for the assignment. This should be uniform for all charts for consistency reasons
  generateData() {
    this.state.data = []

    //generate datapoints
    var i = 0;
    for(i = 0; i< 10; i++){
      var x = Math.floor(Math.random() * 99) +1;
      this.state.data.push([x, i*8])
    }
    //console.log(this.state.data);
    //console.log(this.state.data[0]);
  }
  //function to generate indices (not the same, and not right next to each other)
  generateIndexes() {
    var compareIndexA = Math.floor(Math.random() * 10);
    var compareIndexB = compareIndexA;
    //make sure compared bars are not hte same or next to each other
    while(compareIndexA === compareIndexB | Math.abs(compareIndexA - compareIndexB) === 1){
      compareIndexB = Math.floor(Math.random() * 10);
    }
    //console.log(compareIndexB);
    //console.log(compareIndexA);

    this.state.trialIndexA = compareIndexA;
    this.state.compareIndexB = compareIndexB;
    return [compareIndexA, compareIndexB];
  }

  handleSubmit(event) {
    event.preventDefault();
    this.state.trialNum++;

    this.state.graphTrial++;
    if(this.state.graphTrial < 4){
    axios({ //This is the call to add to the database
          method: 'post',
          url: 'https://karoad-psite-api.herokuapp.com/api/cs4802/project3/createresponse',
          data: {
              //Put experiment results in here
              "participant_id": this.state.participantID, 
              "trial_number": this.state.trialNum, 
              "viz_type": this.state.viz,
              "true_percentage": this.state.truePercent,
              "reported_percentage": this.state.reportedPercent,
          }}).then(res => console.log(res)).catch(err => console.log(err.response));
    }
    //Change Graph
    if(this.state.graphTrial < 3){
      d3.select(this.myRef.current).select("svg").remove();
      var svg = d3.select(this.myRef.current).append("svg").style("background-color", "white");
      if(this.state.graphTrial % 3 === 0){
        this.randomBarGraph(svg);
      }else if(this.state.graphTrial % 3 === 1){
        this.randomBubbleChart(svg);
      }else if(this.state.graphTrial % 3 === 2){
        this.randomGradient(svg);
      }
    }else{
      d3.select(this.myRef.current).select("svg").remove();
      d3.select("#description").text("You are done thank you!");
      d3.select("#hideMe").text(" ");
      d3.select("#newButton").text("Results").style('color', '#d9d964');
      alert("You are done thank you!");
      
    }
  } 

  randomBarGraph(svg) {
    this.state.viz = "BarGraph";
    this.handleResize();
    var margin = {top: 10, right: 30, bottom: 30, left: 60};
    let { windowWidth, windowHeight } = this.state; 
    let w = windowWidth / 3;
    let h = windowHeight / 3; 

    d3.select("#description").text("Enter your guess below, what percententage is the smaller marked bar to the larger marked bar?");

    svg
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .attr("viewBox", '0 0 100 110')

    var data = this.state.data;
    var compareIndexes = this.generateIndexes();
    var compareIndexA = compareIndexes[0];
    var compareIndexB = compareIndexes[1];

    //this is to align the center of the circle with the center of the bar
    //IMO this method shouldn't use a hardcoded val unless r of the circle is hardcoded
    var compareData = [data[compareIndexA][1]+2.5, data[compareIndexB][1]+2.5]

    svg.selectAll('rect')
    .data(data)
    .enter().append('rect')
    .attr('x', function(d){return d[1]})
    .attr('y', function(d){return 100 - d[0]})
    .attr('width', '5%')
    .attr('height', function(d){return d[0]})
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    .attr('fill', 'white');

  
    svg.selectAll("circle")
    .data(compareData)
    .enter().append("circle")
    .attr('cy', '103')
    .attr('cx', function(d){return d})
    .attr('r', '1.5%')
    .attr('fill', 'black');

    //console.log(data[compareIndexA][1]);
    //console.log(data[compareIndexB][1]);
    this.state.truePercent =  100 * (Math.min(data[compareIndexA][0], data[compareIndexB][0]) / Math.max(data[compareIndexA][0], data[compareIndexB][0]));
    //console.log(this.state.truePercent);
  }
  
  randomBubbleChart(svg){
    this.state.viz = "BubbleChart";
    var data = this.state.data;
    var compareIndexes = this.generateIndexes();
    var compareIndexA = compareIndexes[0];
    var compareIndexB = compareIndexes[1];

    d3.select("#description").text("Enter your guess below, what percententage is the smaller marked circle to the larger marked circle?");

    this.handleResize();
    var margin = {top: 10, right: 30, bottom: 30, left: 60};
    let { windowWidth, windowHeight } = this.state; 
    let w = windowWidth / 3;
    let h = windowHeight / 3; 

    var width =  w + margin.left + margin.right;
    var height = h + margin.top + margin.bottom;
    svg
    .attr('width', width)
    .attr('height', height)
    .attr("viewBox", '0 0 100 110')

    var x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);
    
    var y = d3.scaleLinear()
      .domain([0,100])
      .range([height, 0]);
    

    var compareData = [data[compareIndexA][1]+2.5, data[compareIndexB][1]+2.5]

    //console.log(data);

    var prevR = 4;
    var soFar = 0;
    // Adding bubbles
    svg.append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr('cx', function(d, i){ 
        var val1; 
        if (i === 0) { val1 = d[1] + d[0]/10 }
        else { val1 = d[0]/10 + data[i-1][0]/10 + soFar + 2;} 
        soFar = val1;
        return val1;
        })
      .attr('cy', function(d){return 50})
      .attr("r", function(d){
        var val = (d[0]/10);
        return val;})
      .style("fill", "#FFFFFF")
      .style("opacity", function(d){return 1;})
      .attr("stroke", "black")
      .attr("stroke-width", function(d){
        if(d[1] === (compareData[0]-2.5)||d[1] === (compareData[1]-2.5)){
          return "1%";
        }
        else{
          return ".5";
        }
      })
  
    console.log(data[compareIndexA][1]);
    console.log(data[compareIndexB][1]);
    this.state.truePercent =  100 * (Math.min(data[compareIndexA][0], data[compareIndexB][0]) / Math.max(data[compareIndexA][0], data[compareIndexB][0]));
    console.log(this.state.truePercent);
  }

  randomGradient(svg){
    this.state.viz = "GradientGraph";
    this.handleResize();
    var margin = {top: 10, right: 30, bottom: 30, left: 60};
    let { windowWidth, windowHeight } = this.state; 
    let w = windowWidth / 3;
    let h = windowHeight / 3; 

    d3.select("#description").text("Enter your guess below, what percententage is the smaller marked gradient to the larger marked gradient?");

    svg
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .attr("viewBox", '0 0 100 110')

    //gradient for bars
    var gradDefs = svg.append("defs")

    var grad = gradDefs.append("linearGradient")
    .attr("id", "barGradient")
    .attr("x1", '0%')
    .attr("x2", '100%')
    .attr("y1", '0%')
    .attr("y2", '100%')
    .attr("gradientTransform", "rotate(50)")

    grad.append("stop")
    .attr("class", "start")
    .attr('stop-color', 'black')
    .attr("offset", "0")

    grad.append("stop")
    .attr('stop-color', 'white')
    .attr("offset", "100%")
    .attr("class", "end")


    var data = this.state.data
    var compareIndexes = this.generateIndexes();
    var compareIndexA = compareIndexes[0];
    var compareIndexB = compareIndexes[1];

    var compareData = [data[compareIndexA][1]+2.5, data[compareIndexB][1]+2.5]

    svg.selectAll('rect')
    .data(data)
    .enter().append('rect')
    .attr('x', function(d){return d[1]})
    .attr('y', function(d){return 100 - d[0]})
    .attr('width', '5%')
    .attr('height', function(d){return d[0]})
    .attr('fill', 'url(#barGradient)')

  
    svg.selectAll("circle")
    .data(compareData)
    .enter().append("circle")
    .attr('cy', '102')
    .attr('cx', function(d){return d})
    .attr('r', '1.5%')
    .attr('fill', 'black');

    console.log(data[compareIndexA][1]);
    console.log(data[compareIndexB][1]);
    this.state.truePercent =  100 * (Math.min(data[compareIndexA][0], data[compareIndexB][0]) / Math.max(data[compareIndexA][0], data[compareIndexB][0]));
    console.log(this.state.truePercent);
  }

  render() {
    
    return (
      <div>
        <div ref={this.myRef}>
        </div>
        <h3 id="description"> Enter your guess below, what percententage is the small marked value to the large marked value?</h3>
        <h5 id="hideMe">  E.g. enter "50"(no quotes) to guess that the small value is half as large as the big value</h5>
        <div>
          <form onSubmit={this.handleSubmit}>
              <label>
                Guess: 
                <input
                  name="reportedPercent"
                  type="number"
                  value={this.state.reportedPercent}
                  onChange={this.handleReportedPercentChange} />
              </label>
              <input type="submit" value="Submit" />
          </form>
       </div>
       
       <div className="navigationMenu center">
                <ul>
                    <li>
                      <Button id="newButton" className="navButton" to="/projects/cs4802/project3/results" component={Link}>
            
                      </Button>
                    </li>
                </ul>
        </div>
      </div>
    );
    
  }
} 

export default DatabaseExample;