import React from "react";
import noNetworkImage from "./noNetwork.svg"
import './noNetwork.css'

export default class NoNetwork extends React.Component {
    render(){
        return(
            
                <img className='no-network' src={noNetworkImage} alt="No network"></img>
            
        )
    }
}