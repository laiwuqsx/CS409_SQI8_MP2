import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { tmdb } from "../api/tmdb";
import { useList } from "../context/ListContext";
import s from "./ListPage.module.css";

type SortKey = "title" | "rating" | "time";
type Order = "asc" | "desc";

export default function ListPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const { setList } = useList();

  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const sortBy = (params.get("sortBy") as SortKey) || "title";
  const order = (params.get("order") as Order) || "asc";

  useEffect(() => {
    tmdb.popular200().then((arr) => setMovies(arr));
  }, []);

  const filteredSorted = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];

    let arr = movies.filter((m) =>
      (m.title || "").toLowerCase().includes(query)
    );

    const cmp = (a: any, b: any) => {
      let A: any;
      let B: any;

      switch (sortBy) {
        case "rating":
          A = Number(a.vote_average ?? 0);
          B = Number(b.vote_average ?? 0);
          break;
        case "time":
          A = a.release_date ? new Date(a.release_date).getTime() : 0;
          B = b.release_date ? new Date(b.release_date).getTime() : 0;
          break;
        default:
          A = (a.title ?? "").toLowerCase();
          B = (b.title ?? "").toLowerCase();
      }

      if (A < B) return order === "asc" ? -1 : 1;
      if (A > B) return order === "asc" ? 1 : -1;
      return 0;
    };

    return arr.sort(cmp);
  }, [movies, q, sortBy, order]);

  useEffect(() => {
    setList(filteredSorted);
  }, [filteredSorted, setList]);

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    next.set(k, v);
    setParams(next, { replace: true });
  };

  return (
    <div className={s.container}>

      <div className={s.panel}>
        <input
          className={s.input}
          placeholder="Search for movies"
          value={q}
          onChange={(e) => setParam("q", e.target.value)}
        />

        <div className={s.row}>
          <label className={s.label}>Sort by:</label>
          <select
            className={s.select}
            value={sortBy}
            onChange={(e) => setParam("sortBy", e.target.value)}
          >
            <option value="title">Title</option>
            <option value="rating">Rating</option>
            <option value="time">Time</option>
          </select>
        </div>

        <div className={s.row}>
          <label className={s.radioLabel}>
            <input
              type="radio"
              checked={order === "asc"}
              onChange={() => setParam("order", "asc")}
            />
            ascending
          </label>
          <label className={s.radioLabel}>
            <input
              type="radio"
              checked={order === "desc"}
              onChange={() => setParam("order", "desc")}
            />
            descending
          </label>
        </div>
      </div>

      {q.trim() ? (
        <ul className={s.list}>
          {filteredSorted.map((m) => (
            <li key={m.id} className={s.item}>
              <Link to={`/movie/${m.id}`} className={s.link}>
                <img
                  src={tmdb.img(m.poster_path, "w185")}
                  alt={m.title}
                  className={s.thumb}
                />
                <div>
                  <div className={s.movieTitle}>{m.title}</div>
                  <div className={s.meta}>
                    Rating: {m.vote_average ?? "-"} · Released:{" "}
                    {m.release_date ?? "-"}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className={s.placeholder}>Type to search…</div>
      )}
    </div>
  );
}
