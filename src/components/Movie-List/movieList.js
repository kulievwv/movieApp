import React, { Component } from 'react';
import MovieCard from '../Movie/movie';
import Loading from '../Loading/loading';
import './movieList.css'

class MovieList extends Component {

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