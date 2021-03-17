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
    
    var projection = d3.geoAlbersUsa()
      .translate([w/2, h/2])    // translate to center of screen
      .scale([1300]);          // scale things down so see entire US

    var svg = d3.select(this.myRef.current)
			.append("svg")
			.attr("width", w)
			.attr("height", h);

    var path = d3.geoPath()
      .projection(projection);
    
    d3.json("data/us-states.json").then(states=> {
      svg.selectAll("path")
        .data(states.features)
        .enter()
        .append("path")
        .attr("id", function(d) { return d.properties.name;})
        .attr("d", path)
        .style("stroke", "grey")
        .style("fill", "rgb(213,222,217)");
    });
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  render() {
    return <div>
              <h4>USA Map Component</h4>
              <div className="mapUSA" ref={this.myRef}></div>  
           </div>
  }
} 

export default USAMap;