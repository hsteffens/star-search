# StarSearch

## Project Summary

StarSearch is a web application that empowers users to search for characters and movies. Built with Next.js, the app leverages modern web technologies to deliver a fast and responsive user experience.  It interacts with external APIs to fetch and display relevant information about movies and people.

## Tech Stack

*   **Next.js:** React framework for building the application.
*   **React:** JavaScript library for building the user interface.
*   **TypeScript:** Typed superset of JavaScript for enhanced type safety and maintainability.
*   **Node.js:** JavaScript runtime environment for building and running the application.
*   **Docker:** Platform for containerizing and running the application in a consistent environment across different systems.
*   **ESLint:** Linter to enforce code quality and consistency.

## Architecture Overview

This application uses Next.js as a full-stack framework, handling both frontend and backend functionalities.

### Frontend

The frontend consists of three routes:

*   `/` (Home page)
*   `/person-details/[id]` (Person details page)
*   `/movie-details/[id]` (Movie details page)

**Rendering Strategy:**

*   **Client-Side Rendering (CSR):**  The majority of the pages are built using CSR components.
*   **Server-Side Rendering (SSR):** Two specific components utilize SSR to fetch and load person and movie data from external APIs.

**State Management:**

*   Context API is used to manage the person and movie data.
*   While multiple components can read the state, only the search component has the authority to update it.

### Backend

The backend provides a single API endpoint:

*   `/api/stats`: This public API endpoint is used to track the performance of the integration with the external APIs.

![start-search-architecture](https://github.com/user-attachments/assets/86874cef-0016-4c3a-9e36-b97b278e9bb3)


## Prerequisites

*   Node.js (v20 or later)
*   Docker

## How to Run Locally

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/hsteffens/star-search.git](https://github.com/hsteffens/star-search.git)
    cd starsearch
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set Environment Variables:**

    Create a `.env.local` file in the root of the project and add the following environment variables:

    ```
    SWAPI_URL=[https://swapi.dev/api/](https://swapi.dev/api/)
    RETRIES=3  # Optional: Number of retry attempts (defaults to 3)
    ```

    See the [Environment Variables](#environment-variables) section for more details.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

5.  **Access the application:**

    ```
    http://localhost:3000/
    ```
## How to Run Using Docker

1.  **Set Environment Variables:**

    Create a `/star-search/.env.local` file in the root of the project and add the following environment variables:

    ```
    SWAPI_URL=[https://swapi.dev/api/](https://swapi.dev/api/)
    RETRIES=3  # Optional: Number of retry attempts (defaults to 3)

2.  **Build the Docker image:**

    ```bash
    docker-compose build
    ```

3.  **Start the Docker container:**

    ```bash
    docker-compose up -d  # Add -d for detached mode (runs in the background)
    ```

3.  **Access the application:**

    ```
    http://localhost:3000/
    ```
4.  **Stop the Docker container:**

    ```bash
    docker-compose down
    ```


## API Endpoints

### Application Statistics Metrics (`/api/stats`)

This endpoint provides application statistics, including:

*   `topQueries`: A list of all performed requests with a count of requests for each route.
*   `averageRequestTiming`: A list of average response times for each request.

Example usage:

```bash
curl --location 'http://localhost:3000/api/stats'
```

## Environment Variables

This application utilizes the following environment variables:

*   `SWAPI_URL`: This variable defines the base URL for the Star Wars API (SWAPI) used to fetch data.  For example: `https://swapi.dev/api/`
*   `RETRIES`: This variable specifies the number of retry attempts to be made when requests to the external API fail.  This can be a numerical value. For example: `3`

**Note:**  It's crucial to configure these environment variables appropriately for the application to function correctly.  The specific method for setting these variables will depend on the deployment environment (e.g., `.env.local` files for local development, platform-specific settings for cloud deployments).
