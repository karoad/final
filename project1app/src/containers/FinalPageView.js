import React from 'react';
import * as d3 from 'd3';
import HeaderBar from '../components/HeaderBar'
import USAMap from '../components/finalproject/USAMap'
import IndustryEffects from '../components/finalproject/IndustryEffects'
import RestrauntCaseStudy from '../components/finalproject/RestrauntCaseStudy'

function FadeInSection(props) {
    const [isVisible, setVisible] = React.useState(false);
    const domRef = React.useRef();
    
    React.useEffect(() => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => setVisible(entry.isIntersecting));
      });
      observer.observe(domRef.current);
    }, []);
    return (
      <div
        className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
        ref={domRef}
      >
        {props.children}
      </div>
    );
  }

class FinalPageView extends React.Component{

    
    constructor(props) {
      super(props);
      this.myRef = React.createRef();
      this.state = { windowWidth: window.innerWidth,
                     windowHeight: window.innerHeight };

      this.svgTest1 = React.createRef();
      this.svgTest2 = React.createRef();
      this.svgTest3 = React.createRef();   
                    
    }
  

    componentDidMount(){
      //Responsive Sizing
      window.addEventListener("resize", this.handleResize);
      let { windowWidth, windowHeight } = this.state; 
      let w = windowWidth / 2;
      let h = windowHeight / 2; 
      //Create Background Region
      let svg1 = d3.select(this.svgTest1.current)
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("background-color", "green");

      let svg2 = d3.select(this.svgTest2.current)
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("background-color", "blue");

      let svg3 = d3.select(this.svgTest3.current)
        .append("svg")
        .attr("width", w)
        .attr("height", 2*h)
        .style("background-color", "red");
    }


    //Currently using a FadeInSection function found at https://webdesign.tutsplus.com/tutorials/simple-fade-effect-on-scroll--cms-35166
    //However should be updated/improved using https://www.superhi.com/library/posts/how-to-add-web-design-elements-that-fade-in-and-out-on-scroll
    render(){
        return(
            <div>
                <HeaderBar/>
                <h1>Title</h1>
                <div ref={this.svgTest1}></div>
                
                <FadeInSection>
                  <h2>Subtitle</h2>
                  <div ref={this.svgTest2}></div>
                </FadeInSection>
                <FadeInSection>
                  <h2>Subtitle</h2>
                  <div ref={this.svgTest3}></div>
                </FadeInSection>
                
            </div>
        );
    }
}

export default FinalPageView;
