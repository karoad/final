import React, { Component } from 'react';
import * as d3 from 'd3';

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
    let h = windowHeight / 2; 
    //Create Background Region
    //Access D3 this way, use width and height to size dynamically
    let accessToRef = d3.select(this.myRef.current).append("svg");
    accessToRef.append("circle").attr("id", "first");
    //Give circles a random size and position them along the x axis
    let circle = d3.select(this.myRef.current).selectAll("circle")
    .attr("r", function() { return h/6 })
    .attr("fill", "red")
    .attr('transform', 'translate(' + w/4+ ',' + h/6  + ')');
    
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  render() {
    return <div>
              <h4>USA Map Component</h4>
              <div className="circleDiv" ref={this.myRef}></div>  
           </div>
  }
} 

export default USAMap;