import React, { Component } from 'react';
import MovieCard from '../Movie/movie';
import PropTypes from 'prop-types';
import './movieList.css'

class MovieList extends Component {
    propTypes = {
        movieList: PropTypes.arrayOf(PropTypes.object).isRequired,
        genresMap: PropTypes.object.isRequired,
        keyword: PropTypes.string,
        rateMovies: PropTypes.func.isRequired
    }
    render(){
        const {movieList, genresMap, keyword, rateMovies} = this.props;
        const movieCards = movieList.map((movie) => {
            return (
                <MovieCard data={movie} genresMap={genresMap} rateMovies={rateMovies} key={movie.id}/>
            ) 
        });

        
        if(movieList.length === 0){
            return(
                <div className='no-results'>По запросу <b>{keyword}</b> нет результатов.</div>
            )
        }
        return (
            <div className='movie-list-container'>
                <div className='movieList' >
                    {movieCards}
                </div>
            </div>
        );
    }
    
}

export default MovieList;