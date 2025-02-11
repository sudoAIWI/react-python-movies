import './App.css';
import {useState, useEffect} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import ActorForm from "./ActorForm";
import ActorsList from "./ActorsList";
import { ToastContentProps, ToastContainer, toast } from 'react-toastify';
import Loading from "./Loading";

function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [actors, setActors] = useState([]);
    const [addingActor, setAddingActor] = useState(false);



    async function handleAddMovie(movie) {
        const response = await fetch('/movies', {
          method: 'POST',
          body: JSON.stringify(movie),
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {toast.success ("Movie added successfully");
          const movieFromServer = await response.json();
          setMovies([...movies, movieFromServer]);
          setAddingMovie(false);
        }
        else {toast.error ("Failed to add movie")}
      }






      useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch(`/movies`);
            if (response.ok) {
                const movies = await response.json();
                setMovies(movies);
            }
            else {toast.error ("Sorry! We couldn't load movies")}
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchActors = async () => {
            const response = await fetch(`/actors`);
            if (response.ok) {
                const actors = await response.json();
                setActors(actors);
            }
            else {toast.error ("Sorry! We couldn't load actors")}
        };
        fetchActors();
    }, []);


    async function handleAddActor(actor) {
        const response = await fetch('/actors', {
          method: 'POST',
          body: JSON.stringify(actor),
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {toast.success ("Actor added successfully")
          const actorFromServer = await response.json();
          setActors([...actors, actorFromServer]);
          setAddingActor(false);
        }
        else {toast.error ("Failed to add actor")}
      }












      async function handleDeleteMovie(movie) {
        const deleteConfirmed = await deleteConfirmationModal();
        if (!deleteConfirmed){
            return;
        }
        const response = await fetch(`/movies/${movie.id}`, {
            method: 'DELETE',
        });
        if (response.ok) {toast.success ("Movie deleted successfully")
            const nextMovies = movies.filter(m => m !== movie);
            setMovies(nextMovies);
        }
        else {toast.error ("Failed to delete movie")}
    }


    async function handleDeleteActor(actor) {
        const deleteConfirmed = await deleteConfirmationModal();
        if (!deleteConfirmed){
            return;
        }
        const response = await fetch(`/actors/${actor.id}`, {
            method: 'DELETE',
        });
        if (response.ok) {toast.success ("Actor deleted successfully")
            const nextActors = actors.filter(m => m !== actor);
            setActors(nextActors);
        }
        else {toast.error ("Failed to delete actor")}
    }







    return (
        <div className="container">
            <h1>My favourite movies to watch</h1>
            {movies.length === 0
                ? <p>No movies yet. Maybe add something?</p>
                : <MoviesList movies={movies}
                              onDeleteMovie={(movie) => setMovies(movies.filter(m => m !== movie))}
                />}
            {addingMovie
                ? <MovieForm onMovieSubmit={handleAddMovie}
                             buttonLabel="Add a movie"
                />
                : <button onClick={() => setAddingMovie(true)}>Add a movie</button>}
        </div>
    );
}

export default App;
