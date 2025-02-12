from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import schemas
import models
from pydantic import BaseModel
import logging
import time



app = FastAPI()
app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")


@app.get("/")
def serve_react_app():
    return FileResponse("../ui/build/index.html")


@app.get("/movies", response_model=List[schemas.Movie])
def get_movies():
    return list(models.Movie.select())


@app.post("/movies", response_model=schemas.Movie)
def add_movie(movie: schemas.MovieBase):
    movie_obj = models.Movie.create(**movie.dict())
    return movie_obj


@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie

@app.put("/movies/{movie_id}", response_model=schemas.Movie)
def update_movie(movie_id: int, movie: schemas.MovieBase):
    db_movie: models.Movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    db_movie.title = movie.title
    db_movie.director = movie.director
    db_movie.year = movie.year
    db_movie.description = movie.description

    db_movie.save()
    return db_movie





@app.delete("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    db_movie.delete_instance()
    return db_movie

#GET http://127.0.0.1:8000/actors
@app.get("/actors", response_model=List[schemas.Actor])
def get_actors():
    return list(models.Actor.select())

#GET http://127.0.0.1:8000/actors/2
@app.get("/actors/{actor_id}", response_model=schemas.Actor)
def get_actors(actor_id: int):
    db_actor = models.Actor.filter(models.Actor.id == actor_id).first()
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    return db_actor

#POST http://127.0.0.1:8000/actors
@app.post("/actors", response_model=schemas.Actor)
def add_actor(actor: schemas.ActorBase):
    actor_obj = models.Actor.create(**actor.dict())
    return actor_obj

#DELETE http://127.0.0.1:8000/actors/2
@app.delete("/actors/{actor_id}", response_model=schemas.Actor)
def delete_actor(actor_id: int):
    db_actor = models.Actor.filter(models.Actor.id == actor_id).first()
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    db_actor.delete_instance() 
    return db_actor

class AssignMoviesRequest(BaseModel):
    movieIds: List[int]

#POST http://127.0.0.1:8000/movies/2/actors
@app.post("/actors/{actor_id}/movies")
def assign_movies_to_actor(actor_id: int, request: AssignMoviesRequest):
    db_actor = models.Actor.filter(models.Actor.id == actor_id).first()
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")

    movies = list(models.Movie.select().where(models.Movie.id.in_(request.movieIds)))

    db_actor.movies.clear()
    for movie in movies:
        db_actor.movies.add(movie)

    return {"message": f"Movies assigned to actor {db_actor.name} {db_actor.surname}"}