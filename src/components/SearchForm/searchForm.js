import React from "react";
import debounce from 'lodash/debounce';
import './searchForm.css';
export default class SearchForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchValue: '',
        }
        this.debouncedSearchMovie = debounce(this.props.changeSearchWord, 700)
    }
    
     handleSearchInputChange = (event) => {
        const {value} = event.target
        this.setState({searchValue: value})
        this.debouncedSearchMovie(value);
    }
    render(){
        return (
            <div className="search">
                <input
                  className="search_input"
                  type="text"
                  value={this.state.searchValue}
                   onChange={this.handleSearchInputChange}
                  placeholder="Type to search..."
                />
            </div>
        )
      
    }
}