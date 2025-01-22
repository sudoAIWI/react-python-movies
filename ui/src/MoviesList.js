import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
    return <div>
        <h2>Movies</h2>
        <ul>
            {props.movies.map(movie => <li key={movie.title}>
                <MovieListItem movie={movie} onDelete={() => props.onDeleteMovie(movie)}/>
            </li>)}
        </ul>
    </div>;
}