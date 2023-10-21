import React, { Component } from 'react';
import './movie.css';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Rate } from 'antd';


class MovieCard extends Component{
    state ={
        stars: 0,
    }
    propTypes = {
        data: PropTypes.shape({
            genre_ids: PropTypes.arrayOf(PropTypes.number),
            title: PropTypes.string,
            overview: PropTypes.string,
            release_date: PropTypes.string,
            id: PropTypes.number,
            vote_average: PropTypes.number,
            rating: PropTypes.number,
            poster_path: PropTypes.string
        }).isRequired,
        genresMap: PropTypes.instanceOf(Map).isRequired,
        rateMovies: PropTypes.func.isRequired
    };
     textReduce = (text, maxLength) => {
        if(text.length > maxLength){
            text = text.slice(0, maxLength);
            text = text.slice(0, text.lastIndexOf(' ')) + '...';
        }
        return text;
    }
    formatDate = (dateString) =>{
        if(!dateString){
            return 'no release date'
        }
        try{
          const date = new Date(dateString);
          const formattedDate =  format(date, 'MMMM d, yyyy');
          return formattedDate;
        }
        catch (error){
            console.error(error)
        }
    }
    handleChange = (newValue) =>{
        this.props.rateMovies(this.props.data.id, newValue);
    }
    componentDidMount(){
        const {rating} = this.props.data
        if(rating){
            this.setState({stars: rating})
        }
    }
    render(){
        let { genre_ids, title, overview, release_date, id, vote_average} = this.props.data;
        
        const { genresMap } = this.props;
        let genres = [];
        const descriptionMaxLength = 145;
        const maxGenres = 3;
        const imgFromApi = `https://image.tmdb.org/t/p/original/${this.props.data.poster_path}`;
        const imgNoPicture = 'https://crawfordroofing.com.au/wp-content/uploads/2018/04/No-image-available-2.jpg';
        const titleMaxLength = 30;   
        const description = this.textReduce(overview, descriptionMaxLength);
        title = this.textReduce(title, titleMaxLength);
        const getColor = (star) => {
            const starNumber = parseFloat(star)
      
            if (starNumber >= 0 && starNumber < 3) {
              return { borderColor: '#E90000' }
            } else if (starNumber >= 3 && starNumber < 5) {
              return { borderColor: '#E97E00' }
            } else if (starNumber >= 5 && starNumber < 7) {
              return { borderColor: '#E9D100' }
            } else if (starNumber >= 7) {
              return { borderColor: '#66E900' }
            } else {
              return { borderColor: 'black' }
            }
          }

        const releaseDate = this.formatDate(release_date);
        
        if(genre_ids.length !== 0){
            genre_ids = genre_ids.slice(0, maxGenres);
             genres = genre_ids.map(genre => 
                <div className='card-genre' key={genre}>{genresMap.get(genre)}</div>);
        }
 
        const imgUrl = this.props.data.poster_path ? imgFromApi : imgNoPicture;

        return(
            <div className='card' key={id}>
                <img src={imgUrl} className='poster' alt={title} />
                <div className='cardData'>
                    <div className='card-header'>
                        <div className='card-title'>{title}</div>
                        <span className="card_star" style={getColor(vote_average)}>
                        {parseFloat(vote_average).toFixed(1)}
                        </span>
                        <div className='card-date'>{releaseDate}</div>
                    </div>
                    <div className='card-content'>
                        {genres}
                        <div className='card-description'>{description}</div>
                    </div>
                    <Rate className='rating' count={10} defaultValue={this.props.data.rating ? this.props.data.rating : 0 }  onChange={this.handleChange} allowHalf destroyInactiveTabPane />
                </div>
            </div>
        )
    }
}

export default MovieCard;
