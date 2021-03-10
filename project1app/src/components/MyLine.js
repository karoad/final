import React, { Component } from 'react';
import * as d3 from 'd3';
import Button from "@material-ui/core/Button";

class MyLine extends Component {

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
    .style("background-color", "yellow")
    //Append line
    .append('line') //Append Line
    .attr('x1', 0) //left
    .attr('y1', h) //bottom
    .attr('x2', w) //right
    .attr('y2', 0) //top
    .attr('stroke', 'purple');
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  randomLineChange = (w, h) => {
    let accessToRef = d3.select(this.myRef.current).selectAll('line')
      accessToRef.attr('x1', function() { return Math.random() * w; })
      .attr('y1', function() { return Math.random() * h; })
      .attr('x2', function() { return Math.random() * w; })
      .attr('y2', function() { return Math.random() * h; });
  }
  
  render() {
    window.addEventListener("resize", this.handleResize);
    let { windowWidth, windowHeight } = this.state; 
    let w = windowWidth / 2;
    let h = windowHeight / 2;
    return (<div>
              <div className="rectDiv" ref={this.myRef}></div>
              <Button  onClick={() => {this.randomLineChange(w, h)}}>
                            Click for new random line!
              </Button>
            </div>
            );
  }
} 

export default MyLine;