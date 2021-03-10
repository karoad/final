import React from 'react';

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

    state = {
            
    };

    //Currently using a FadeInSection function found at https://webdesign.tutsplus.com/tutorials/simple-fade-effect-on-scroll--cms-35166
    //However should be updated/improved using https://www.superhi.com/library/posts/how-to-add-web-design-elements-that-fade-in-and-out-on-scroll
    render(){
        return(
            <div>
                <HeaderBar/>
                <FadeInSection>
                    <USAMap></USAMap>
                </FadeInSection>
                <FadeInSection>
                    <IndustryEffects></IndustryEffects>
                </FadeInSection>
                <FadeInSection>
                    <RestrauntCaseStudy></RestrauntCaseStudy>
                </FadeInSection>
                
            </div>
        );
    }
}

export default FinalPageView;
