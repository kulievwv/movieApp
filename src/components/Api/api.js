/* eslint-disable no-lone-blocks */
export default class Api {
    constructor(){
        this.movieApi =  'https://api.themoviedb.org/3';
        this.apiKey = '69b7fc08eca99073d6d079471e1b5052';
        this.optionsGet = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWI3ZmMwOGVjYTk5MDczZDZkMDc5NDcxZTFiNTA1MiIsInN1YiI6IjY1MTZiNDk1ZWE4NGM3MDBlYjk4YWY3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.U5Y7Kv3x-5GJBAtK8AkGkNSRYDV_urhalHI7hSWrLQc'
            }
          };
        this.optionPost = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWI3ZmMwOGVjYTk5MDczZDZkMDc5NDcxZTFiNTA1MiIsInN1YiI6IjY1MTZiNDk1ZWE4NGM3MDBlYjk4YWY3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.U5Y7Kv3x-5GJBAtK8AkGkNSRYDV_urhalHI7hSWrLQc'
            }
        }    
    }
    async getGenres(){
        let genresMap;
        try{
            const response = await fetch(`${this.movieApi}/genre/movie/list?language=en`, this.optionsGet);
            if(response.ok){
                const data = await response.json();
                if (data.genres && data.genres.length > 0){
                    genresMap = new Map();
                    data.genres.forEach(genre => {
                        genresMap.set(genre.id, genre.name);
                    });
                return genresMap;
            }
            else{
                throw new Error(`Проблема: ${response.status}`)
            }
        }
        }
        catch(error){ {
            console.error(error);
          }
        }
    }

    async apiResponse(url, methodOption) {
        try {
            const response = await fetch(url, methodOption);
            if (response.ok) {
                const data = await response.json();
                return data; 
            } else {
                throw new Error(`Проблема: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    async searchMovies(keyword, page) {
        return this.apiResponse(`${this.movieApi}/search/movie?query=${keyword}&include_adult=false&language=ru-Ru&page=${page}`, this.optionsGet);
    }
    
    async createSession() {
        const guestSessionId = window.localStorage.getItem('guestID')
        if (guestSessionId) {
        console.log(guestSessionId);
        return guestSessionId
        } else {
        const url = `${this.movieApi}/authentication/guest_session/new?api_key=${this.apiKey}`
        
        return fetch(url)
            .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(`Проблема: ${response.status}`)
            }
            })
            .then((data) => {
            const { guest_session_id } = data
            localStorage.setItem('guestID', guest_session_id)
            return guest_session_id
            })
            .catch((error) => {
            throw error
            })
        }
    }
    
    async rateMovie(guest_session_id, movie_id, rating){
        fetch(`${this.movieApi}/movie/${movie_id}/rating?api_key=${this.apiKey}&guest_session_id=${guest_session_id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              value: rating,
            }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`Проблема: ${response.status}`)
            }
          })
          .catch((error) => {
            throw error
          })
        }

    getRatedMovies = (guestSessionId, page) => {
            const url = `${this.movieApi}/guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}&language=ru-RU&page=${page}`
            console.log(`getRated movies: ${guestSessionId}`)
            return fetch(url)
              .then((response) => {
                if (response.ok) {
                  return response.json()
                } else {
                  throw new Error(`Проблема: ${response.status}`)
                }
              })
              .catch((error) => {
                throw error
              })
          }
}