import React, { Component } from 'react';
import * as d3 from 'd3';

class RestrauntCaseStudy extends Component {

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
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  } 

  render() {
    return <div>
              <h4>RestrauntCaseStudy Component</h4>
           </div>
  }
} 

export default RestrauntCaseStudy;