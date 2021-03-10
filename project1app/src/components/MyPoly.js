import React, { Component } from 'react';
import * as d3 from 'd3';

class MyPoly extends Component {

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
    .style("background-color", "blue");
    //Get points to make a pentagram
    var points = [
      [w/2,h/2],
      [w/2+50,h/2+30],
      [w/2-50,h/2+30],
      [w/2-25,h/2+85],
      [w/2+25,h/2+85]];
    //Fit polygon around pentagram
    var hull = d3.polygonHull(points);
    //Draw polygon
    var line = d3.line()
    .curve(d3.curveLinearClosed);
    accessToRef.append("path")
    .attr("d", line(hull));
    
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  render() {
    return <div className="polyDiv" ref={this.myRef}></div>  
  }
} 

export default MyPoly;