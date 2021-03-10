import React from 'react';

import HeaderBar from '../components/HeaderBar'
import MyCircle from '../components/MyCircle'
import MyRect from '../components/MyRect'
import MyLine from '../components/MyLine'
import MyPoly from '../components/MyPoly'

class Project2PageView extends React.Component{

    state = {
            
    };

    render(){
        return(
            <div>
                <HeaderBar/>
                <h5>
                    This project has not been completed yet!
                </h5>
            </div>
        );
    }
}

export default Project2PageView;
