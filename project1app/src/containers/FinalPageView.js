import React from 'react';
import * as d3 from 'd3';
import HeaderBar from '../components/HeaderBar'
import USAMap from '../components/finalproject/USAMap'
import IndustryEffects from '../components/finalproject/IndustryEffects'
import RestrauntCaseStudy from '../components/finalproject/RestrauntCaseStudy'
import { Fade } from '@material-ui/core';

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

      let svg3 = d3.select(this.svgTest3.current)
        .append("svg")
        .attr("width", w)
        .attr("height", h+h/2)
        .style("background-color", "red");
    }


    //Currently using a FadeInSection function found at https://webdesign.tutsplus.com/tutorials/simple-fade-effect-on-scroll--cms-35166
    //However should be updated/improved using https://www.superhi.com/library/posts/how-to-add-web-design-elements-that-fade-in-and-out-on-scroll
    render(){
        return(
            <div>
                <HeaderBar/>
                  <br></br>
                  <br></br>

                <FadeInSection>
                  <IndustryEffects></IndustryEffects>
                </FadeInSection>
                
                <FadeInSection>
                  <br></br>
                  <br></br>
                  <h1>Seated Diners at Restaurants Open for Reservations Across the United States</h1>
                  <USAMap></USAMap>       
                </FadeInSection> 
                                       
                <FadeInSection>
                  <br></br>
                  <br></br>
                  <RestrauntCaseStudy></RestrauntCaseStudy>
                </FadeInSection>
                
                  <br></br>
                  <br></br>
            </div>
        );
    }
}

export default FinalPageView;
