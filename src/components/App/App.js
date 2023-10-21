import React from 'react';
import './App.css';
import MovieList from '../Movie-List/movieList';
import Loading from '../Loading/loading';
import NoNetwork from '../NoNetwork/noNetwork';
import SearchForm from '../SearchForm/searchForm';
import Api from '../../Api/api';
import { Pagination } from 'antd';
import Header from '../Hedaer/header';


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      movieList: [],
      ratedList: [],
      keyword: '',
      genresMap: {},
      hasGenres: false,
      isLoaded: false,
      onError: false,
      isOnline: window.navigator.onLine,
      currentPage: 1,
      totalResults: 0,
      totalRated: 0,
      menu: 'search',
    } 
    this.movieApi.createSession();
    this.sessionId = window.localStorage.getItem('guestID');
  }
  movieApi = new Api();
  handlePageChange = (page) =>{
      if(this.state.menu === 'search'){
        this.searchMovie(this.state.keyword, page);
      }
      else{
        this.getRatedMovies(page)
      }
      
      this.setState({currentPage: page});
  }
  goOnline = () =>{
    this.setState({isOnline: true});
  }  
  goOffline = () =>{
    this.setState({isOnline: false})
  }
  searchMovie = async (word, page) =>{
    this.setState({isLoaded: false, keyword: word});
    const movieApi = new Api();
    try{
      const data = await movieApi.searchMovies(word, page)
        if(data.results && data.results.length > 0 ){
          this.setState({ totalResults: data.total_results,
                          movieList: data.results,
                          isLoaded: true, 
                        })
        }
        else {this.setState({
          isLoaded: true,
          movieList: [],
          totalResults: 0
          })
        }
      }
    catch (error) {
      console.error(error);
    }
  }
  changeSearchWord = (word) =>{
    this.setState({currentPage: 1})
    this.searchMovie(word, 1);
  }
  onChangeMenu = (section) =>{
    try{
      this.setState({menu: section, currentPage: 1})
      if(section === 'rated'){
        this.setState({keyword: ''})
        this.getRatedMovies(1);
      }
    }
    catch(error){
      console.log(error)
    }
  }
  rateMovies = (movie, rating) =>{
    this.movieApi.rateMovie(this.sessionId, movie, rating)
  }
  getRatedMovies = async (page) =>{
      this.setState({isLoaded: false});
      try{
        if(this.sessionId){
          const data = await this.movieApi.getRatedMovies(this.sessionId, page)
          if(data.results && data.results.length > 0 ){
            this.setState({ 
                            totalRated: data.total_results,
                            ratedList: data.results,
                            isLoaded: true, 
                          })
          }
          else {this.setState({
            isLoaded: true,
            ratedList: [],
            })
          }
        }
        }
      catch(error){
        console.log(error);
        this.setState({
          isLoaded: true,
          ratedList: [],
          })
      }
  }
   componentDidMount() {
    this.searchMovie('b', 1);
    window.addEventListener('online', this.goOnline);
    window.addEventListener('offline', this.goOffline);
    this.movieApi.getGenres().then(data => {
      if(data && data.size > 0){
        this.setState( {hasGenres: true} )
        this.setState({genresMap: data});
      }
    });
  }
 
  render() {
   const movies = this.state.movieList;
    let main, pagination, search = ''; 
    if(!this.state.isOnline){   
        search = <SearchForm 
                  changeSearchWord={this.changeSearchWord} 
                  searchValue={this.state.keyword}/> 
        main = <NoNetwork />
    }
    else if( this.state.isLoaded && this.state.hasGenres && this.state.menu === 'search'){
      search = <SearchForm 
                changeSearchWord={this.changeSearchWord} 
                searchValue={this.state.keyword}/>
      main = <MovieList 
                movieList={movies} 
                genresMap={this.state.genresMap}
                keyword={this.state.keyword}
                rateMovies={this.rateMovies}/>
      pagination =  <Pagination 
                      className='pagination'
                      showSizeChanger={false}
                      pageSize={20}
                      current={this.state.currentPage}
                      total={this.state.totalResults} 
                      onChange={this.handlePageChange}/>  
                   
    }
    else if(this.state.isLoaded && this.state.hasGenres && this.state.menu === 'rated'){
      const movieList = this.state.ratedList.reverse()
      main = <MovieList 
                movieList={movieList} 
                genresMap={this.state.genresMap}
                keyword={this.state.keyword}
                rateMovies={this.rateMovies}/>
      pagination =  <Pagination 
                      className='pagination'
                      showSizeChanger={false}
                      pageSize={20}
                      current={this.state.currentPage}
                      total={this.state.totalRated} 
                      onChange={this.handlePageChange}/>  
    }
    if(!this.state.isLoaded){ 
      search = <SearchForm 
                changeSearchWord={this.changeSearchWord} 
                searchValue={this.state.keyword}/> 
      main = <Loading />
      pagination =  ''   
    }          
      return (
        <div className="body">
          <Header 
            changeMenu={this.onChangeMenu}
           />
            {search}
            {main}
            {pagination}
        </div>
      );
    }
  }


export default App;
