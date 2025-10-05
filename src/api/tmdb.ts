import axios from "axios";

const key = process.env.REACT_APP_TMDB_KEY!;
const http = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: key, language: "en-US" },
});

async function fetchPopularPages(pages: number) {
  const reqs = Array.from({ length: pages }, (_, i) =>
    http.get("/movie/popular", { params: { page: i + 1 } })
  );
  const resps = await Promise.all(reqs);
  return resps.flatMap(r => r.data.results as any[]);
}

export const tmdb = {
  img: (path?: string, size = "w342") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : "",

  popular: async (page = 1) =>
    (await http.get("/movie/popular", { params: { page } })).data as { results: any[] },

  popular200: async () => {
    const perPage = 20;
    const pages = Math.ceil(200 / perPage);
    const all = await fetchPopularPages(pages);
    const uniq = Array.from(new Map(all.map(m => [m.id, m])).values());
    return uniq.slice(0, 200);
  },

  detail: async (id: string) =>
    (await http.get(`/movie/${id}`)).data as any,

  genres: async () =>
    (await http.get("/genre/movie/list")).data as {
      genres: { id: number; name: string }[];
    },
};
