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

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  **Access the application:**

    ```
    http://localhost:3000/
    ```

## How to Run Using Docker

1.  **Build the Docker image:**

    ```bash
    docker-compose build
    ```

2.  **Start the Docker container:**

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