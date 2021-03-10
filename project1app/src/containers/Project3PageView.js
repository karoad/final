import React from 'react';
import HeaderBar from '../components/HeaderBar';
import DatabaseExample from '../components/DatabaseExample'

class Project3PageView extends React.Component{

    state = {
            
    };

    render(){
        return(
            <div className="pageFlex">
                <HeaderBar/>
                <div className='homePageList'>
                    <h2> Experiment </h2>
                    <DatabaseExample></DatabaseExample>
                </div>
            </div>
        );
    }
}

export default Project3PageView;
