export const getObjectId = (url: string) => {
    //valid values for url are: https://swapi.dev/api/films/1/, https://swapi.dev/api/people/1/
    const parts = url.split("/"); // Split the string by "/"
    return parts[parts.length - 2]; // The numeric value is the second-to-last part
}