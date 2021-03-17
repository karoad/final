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
      .scale([900]);          // scale things down so see entire US

    var svg = d3.select(this.myRef.current)
			.append("svg")
			.attr("width", w)
			.attr("height", h);

    var path = d3.geoPath()
      .projection(projection);
    
    d3.csv("data/reopened_seated_diner_data.csv").then(function(seatData) {
      console.log(seatData);
      var color = d3.scaleLinear().domain([0,100]).range(["rgb(213,222,217)", "green"]);
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
                colorC = color(seats["JUN12020"]);
              }
            })
            return colorC;
          })
      });

    });
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  render() {
    return <div>
              <h4>USA Map Component</h4>
              <div className="mapUSA" ref={this.myRef}></div>  
              <select id="mapButton"></select>
           </div>
  }
} 

export default USAMap;