import React from 'react';
import HeaderBar from '../components/HeaderBar';
import Project3ExperimentViz from '../components/Project3ExperimentViz'
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

class Project3ResultsView extends React.Component{

    state = {
            
    };

    render(){
        return(
            <div className="pageFlex">
                <HeaderBar/>
                <div className='homePageList'>
                    <Project3ExperimentViz></Project3ExperimentViz>
                </div>
            </div>
        );
    }
}

export default Project3ResultsView;
