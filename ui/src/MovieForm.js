import {useEffect, useState} from "react";
import React from 'react'
import Select from 'react-select'

export default function MovieForm(props) {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [actors, setActors] = useState([]);
    const [selectedActors, setSelectedActors] = useState([]);

    function addMovie(event) {
        event.preventDefault();
        if (title.length < 5) {
            return alert('Tytuł jest za krótki');
        }

        const actors_id = selectedActors.map(actor => actor.value);

        props.onMovieSubmit({title, year, director, description, actors_id});
        setTitle('');
        setYear('');
        setDirector('');
        setDescription('');
        setSelectedActors([]);
    }


    
    useEffect(() => {
        const fetchActors = async () => {
            const response = await fetch('/actors');
            if (response.ok) {
                const actors = await response.json();
                setActors(actors.map(actor => ({
                    value: actor.id,
                    label: `${actor.name} ${actor.surname}`
                })));
            }
        };
        fetchActors();
    }, []);




    return <form onSubmit={addMovie}>
        <h2>Add movie</h2>
        <div>
            <label>Tytuł</label>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)}/>
        </div>
        <div>
            <label>Year</label>
            <input type="text" value={year} onChange={(event) => setYear(event.target.value)}/>
        </div>
        <div>
            <label>Director</label>
            <input type="text" value={director} onChange={(event) => setDirector(event.target.value)}/>
        </div>
        <div>
            <label>Actors</label>
            <Select isMulti options={actors} onChange={(event) => setSelectedActors(event)}/>
        </div>
        <div>
            <label>Description</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)}/>
        </div>
        <button>{props.buttonLabel || 'Submit'}</button>
    </form>;
}
