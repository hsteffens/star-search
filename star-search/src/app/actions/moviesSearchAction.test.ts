import { fetchWrapper } from "../../utils/fetchWrapper";
import { getFilteredMovies, getMovieById, getMoviesByFilmUrl } from "./moviesSearchAction";

jest.mock("../../utils/fetchWrapper", () => ({
  fetchWrapper: jest.fn(),
}));

describe("moviesSearchAction", () => {
  const mockMoviesResponse = {
    results: [{ title: "Star Wars", episode_id: 4 }],
    next: null, // No more pages
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test("getFilteredMovies should fetch and return movies", async () => {
    (fetchWrapper as jest.Mock)
      .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockMoviesResponse) });

    const movies = await getFilteredMovies("star");

    expect(fetchWrapper).toHaveBeenCalledWith(expect.stringContaining("films/?search=star&page=1"));
    expect(movies).toEqual([{ title: "Star Wars", episode_id: 4 }]);
  });

  test("getMoviesByFilmUrl should fetch multiple movie details", async () => {
    (fetchWrapper as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ title: "A New Hope" }) })
      .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ title: "Empire Strikes Back" }) });

    const films = await getMoviesByFilmUrl(["https://swapi.dev/api/films/1", "https://swapi.dev/api/films/2"]);

    expect(fetchWrapper).toHaveBeenCalledTimes(2);
    expect(films).toEqual([{ title: "A New Hope" }, { title: "Empire Strikes Back" }]);
  });

  test("getMovieById should fetch a single movie by ID", async () => {
    process.env.SWAPI_URL = "https://swapi.dev/api/";
    (fetchWrapper as jest.Mock)
      .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue({ title: "Return of the Jedi" }) });

    const movie = await getMovieById("3");

    expect(fetchWrapper).toHaveBeenCalledWith("https://swapi.dev/api/films/3");
    expect(movie).toEqual({ title: "Return of the Jedi" });
  });

  test("getFilteredMovies should handle API errors", async () => {
    (fetchWrapper as jest.Mock).mockRejectedValue(new Error("API Error"));

    const movies = await getFilteredMovies("star");

    expect(movies).toEqual([]); // Should return an empty array on error
  });

  test("getMoviesByFilmUrl should handle individual API errors", async () => {
    (fetchWrapper as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ title: "A New Hope" }) })
      .mockRejectedValueOnce(new Error("API Error"));

    const films = await getMoviesByFilmUrl(["https://swapi.dev/api/films/1", "https://swapi.dev/api/films/2"]);

    expect(films).toEqual([{ title: "A New Hope" }]); // Only one movie is fetched
  });
});
