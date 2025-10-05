import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tmdb } from "../api/tmdb";
import { useList } from "../context/ListContext";
import s from "./GalleryPage.module.css";

export default function GalleryPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const { setList } = useList();

  useEffect(() => {
    tmdb.popular200().then(movies => {
      setMovies(movies);
      setList(movies);
    });
    tmdb.genres().then(d => setGenres(d.genres));
  }, [setList]);

  const filtered = selected
    ? movies.filter(m => m.genre_ids.includes(selected))
    : movies;
  if (filtered) {
    
  }

  return (
    <div className={s.container}>
      <div className={s.filters}>
        <button
          onClick={() => setSelected(null)}
          className={!selected ? s.active : ""}
        >
          All
        </button>
        {genres.map(g => (
          <button
            key={g.id}
            onClick={() => setSelected(g.id)}
            className={selected === g.id ? s.active : ""}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className={s.grid}>
        {filtered.map(m => (
          <Link key={m.id} to={`/movie/${m.id}`}>
            <img
              src={tmdb.img(m.poster_path, "w342")}
              alt={m.title}
              className={s.poster}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
