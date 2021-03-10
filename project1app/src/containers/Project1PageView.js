import React from 'react';

import HeaderBar from '../components/HeaderBar'
import MyCircle from '../components/MyCircle'
import MyRect from '../components/MyRect'
import MyLine from '../components/MyLine'
import MyPoly from '../components/MyPoly'
import Project3ExperimentViz from '../components/Project3ExperimentViz'

class Project1PageView extends React.Component{

    state = {
            
    };

    render(){
        return(
            <div>
                <HeaderBar/>
                <Project3ExperimentViz/>
                <MyCircle/>
                <MyLine/>
                <MyRect/>
                <MyPoly/>

            </div>
        );
    }
}

export default Project1PageView;
