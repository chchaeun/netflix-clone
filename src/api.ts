const API_KEY = "756632b0cb6004a03d07537676dccfbf";
const BASE_URL = "https://api.themoviedb.org/3";

interface IMovies {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
export interface INowPlaying {
  dates: { maximum: string; minimum: string };
  page: number;
  results: IMovies[];
  total_pages: number;
  total_results: number;
}
export function getNowPlaying() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}
