import React, { Component } from 'react';
import * as d3 from 'd3';

class MyRect extends Component {

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
    let accessToRef = d3.select(this.myRef.current)
    //Create Background Region
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "red")
    //Append Rect
    .append('rect') 
    .attr('transform', 'translate(' + (w*0.5 - w/12) + ',' + h*0.25  + ')')
    .attr("fill", "green")
    .attr('width', w / 6)
    .attr('height', w / 4);
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  render() {
    return <div className="rectDiv" ref={this.myRef}></div>  
  }
} 

export default MyRect;