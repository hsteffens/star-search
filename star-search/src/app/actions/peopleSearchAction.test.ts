import { fetchWrapper } from "../../utils/fetchWrapper";
import { getFilteredPeople, getPersonById, getPeopleByCharacterUrl } from "./peopleSearchAction";

jest.mock("../../utils/fetchWrapper", () => ({
  fetchWrapper: jest.fn(),
}));

describe("peopleSearchAction", () => {
  const mockMPersonResponse = {
    results: [{ name: "Yoda" }],
    next: null, // No more pages
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test("getFilteredPeople should fetch and return people", async () => {
    (fetchWrapper as jest.Mock)
      .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockMPersonResponse) });

    const people = await getFilteredPeople("yo");

    expect(fetchWrapper).toHaveBeenCalledWith(expect.stringContaining("people/?search=yo&page=1"));
    expect(people).toEqual([{ name: "Yoda" }]);
  });

  test("getPeopleByCharacterUrl should fetch multiple character details", async () => {
    (fetchWrapper as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ name: "Luke" }) })
      .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ name: "Leia" }) });

    const people = await getPeopleByCharacterUrl(["https://swapi.dev/api/people/1", "https://swapi.dev/api/people/2"]);

    expect(fetchWrapper).toHaveBeenCalledTimes(2);
    expect(people).toEqual([{ name: "Luke" }, { name: "Leia" }]);
  });

  test("getPersonById should fetch a single movie by ID", async () => {
    process.env.SWAPI_URL = "https://swapi.dev/api/";
    (fetchWrapper as jest.Mock)
      .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue({ name: "chewbacca" }) });

    const movie = await getPersonById("3");

    expect(fetchWrapper).toHaveBeenCalledWith("https://swapi.dev/api/people/3");
    expect(movie).toEqual({ name: "chewbacca" });
  });

  test("getFilteredPeople should handle API errors", async () => {
    (fetchWrapper as jest.Mock).mockRejectedValue(new Error("API Error"));

    const person = await getFilteredPeople("yoda");

    expect(person).toEqual([]); // Should return an empty array on error
  });

  test("getPeopleByCharacterUrl should handle individual API errors", async () => {
    (fetchWrapper as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ name: "chewbacca" }) })
      .mockRejectedValueOnce(new Error("API Error"));

    const people = await getPeopleByCharacterUrl(["https://swapi.dev/api/people/1", "https://swapi.dev/api/people/2"]);

    expect(people).toEqual([{ name: "chewbacca" }]); // Only one person is fetched
  });
});
