import React, { Component } from 'react';
import * as d3 from 'd3';

class MyCircle extends Component {

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
    let accessToRef = d3.select(this.myRef.current)
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "green");
    //Append circles with ids
    accessToRef.append("circle").attr("id", "first");
    accessToRef.append("circle").attr("id", "second");
    accessToRef.append("circle").attr("id", "third");
    //Give circles a random size and position them along the x axis
    let addCircles = d3.select(this.myRef.current).selectAll("circle")
    .attr("r", function() { return Math.random() * w * 0.10; })
    .attr("fill", "red");
    //Position the circles
    let sFirst = d3.select(this.myRef.current).select("#first").attr('transform', 'translate(' + w*0.25 + ',' + h*0.5  + ')');
    let sSecond = d3.select(this.myRef.current).select("#second").attr('transform', 'translate(' + w*0.5 + ',' + h*0.5  + ')');
    let sThird = d3.select(this.myRef.current).select("#third").attr('transform', 'translate(' + w*0.75 + ',' + h*0.5  + ')');
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  render() {
    return <div>
              <h4>Refresh Page to change circle size!</h4>
              <div className="circleDiv" ref={this.myRef}></div>  
           </div>
  }
} 

export default MyCircle;