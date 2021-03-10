import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
 
class HeaderBar extends Component {

    state = {
        
    };

    render() {
        return (
        <header>

            <div className="logo">

                <h1>
                    CS4801 - Project Site
                </h1>

            </div>

            <div className="navigationMenu">

                <ul>
                    <li>
                        <Button className="navButton" to="/" component={Link}>
                            Home
                        </Button>
                    </li>

                    <li>
                        <Button className="navButton" to="/project1" component={Link}>
                            a1
                        </Button>
                    </li>

                    <li>
                        <Button className="navButton" to="/project2" component={Link}>
                            a2
                        </Button>
                    </li>

                    <li>
                        <Button className="navButton" to="/projects/cs4802/project3/disclaimer" component={Link}>
                            a3
                        </Button>
                    </li>

                    <li>
                        <Button className="navButton" to="/project4" component={Link}>
                            a4
                        </Button>
                    </li>

                    <li>
                        <Button className="navButton" to="/project5" component={Link}>
                            a5
                        </Button>
                    </li>
                </ul>
                
            </div>
            
        </header>
        );
    }
}

 
export default HeaderBar;