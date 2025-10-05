import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tmdb } from "../api/tmdb";
import { useList } from "../context/ListContext";
import s from "./DetailPage.module.css";

export default function DetailPage() {
  const { id = "" } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const { list } = useList();
  const nav = useNavigate();

  useEffect(() => {
    tmdb.detail(id).then(setMovie);
  }, [id]);

  const idx = useMemo(
    () => list.findIndex(m => String(m.id) === String(id)),
    [list, id]
  );
  const prevId = idx > 0 ? list[idx - 1]?.id : undefined;
  const nextId = idx >= 0 && idx < list.length - 1 ? list[idx + 1]?.id : undefined;

  if (!movie) return <div className={s.loading}>Loading...</div>;

  return (
    <div className={s.container}>
      <div className={s.navButtons}>
        <button disabled={!prevId} onClick={() => prevId && nav(`/movie/${prevId}`)}>
          ← Prev
        </button>
        <button disabled={!nextId} onClick={() => nextId && nav(`/movie/${nextId}`)}>
          Next →
        </button>
      </div>

      <div className={s.content}>
        <img
          src={tmdb.img(movie.poster_path, "w500")}
          alt={movie.title}
          className={s.poster}
        />

        <div className={s.details}>
          <h2 className={s.title}>{movie.title}</h2>
          <p className={s.overview}>{movie.overview}</p>
          <p><strong>Released:</strong> {movie.release_date}</p>
          <p><strong>Runtime:</strong> {movie.runtime} min</p>
          <p><strong>Rating:</strong> {movie.vote_average}</p>
          {movie.genres && (
            <p><strong>Genres:</strong> {movie.genres.map((g: any) => g.name).join(", ")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
