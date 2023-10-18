import React from "react";
import { Menu } from 'antd';
import './header.css'

export default class Header extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            menu: 'search'
        }
    }
    handleClick = (event) => {
        this.setState({menu: event.key})
        this.props.changeMenu(event.key);
    }
    render(){
        return(
            <Menu
                className="menu"
                onClick={this.handleClick}
                selectedKeys={this.state.menu}
                mode="horizontal"
                items={[
                { key: 'search', label: 'Search' },
                { key: 'rated', label: 'Rated' },
                ]}
          />
        )
    }
}