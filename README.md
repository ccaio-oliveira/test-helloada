
# Project Setup and Installation

This project is divided into two parts: the **Backend (Laravel)** and the **Frontend (React with Vite)**. Below are the instructions to set up and run both parts locally.

## Prerequisites

Ensure you have the following tools installed on your system:

- PHP 8.x
- Composer
- Node.js (version 16.x or higher)
- NPM or Yarn
- MySQL (or any other database you are using)

## Backend (Laravel)

### Installation

1. **Navigate to the backend directory**:

    ```bash
    cd backend
    ```

2. **Install PHP dependencies using Composer**:

    ```bash
    composer install
    ```

3. **Create a copy of the `.env` file**:

    ```bash
    cp .env.example .env
    ```

4. **Configure your `.env` file**:

   - Set up your database connection:
     
     ```
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=your_database
     DB_USERNAME=your_db_user
     DB_PASSWORD=your_db_password
     ```

   - Make sure other environment variables like `APP_KEY` are set.

5. **Generate the application key**:

    ```bash
    php artisan key:generate
    ```

6. **Run database migrations**:

    ```bash
    php artisan migrate
    ```

7. **Run the backend server**:

    ```bash
    php artisan serve
    ```

   The Laravel backend should now be running at `http://localhost:8000`.

### API Routes

The backend serves REST API endpoints. The routes can be accessed at:

```
http://localhost:8000/api/{endpoint}
```

## Frontend (React with Vite + Tailwind CSS)

### Installation

1. **Navigate to the frontend directory**:

    ```bash
    cd frontend
    ```

2. **Install Node.js dependencies**:

    If you're using NPM:

    ```bash
    npm install
    ```

    Or, if you're using Yarn:

    ```bash
    yarn
    ```

3. **Install Tailwind CSS**:

    Tailwind CSS is already configured in the project. If you need to set it up manually, follow these steps:

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init
    ```

    Add the following to your `tailwind.config.js` file:

    ```js
    module.exports = {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

4. **Ensure Tailwind is imported in your `index.css` or equivalent file**:

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

5. **Create a `.env` file based on the `.env.example` on the `frontend` directory and add environment variables such as the backend API URL**:

    ```
    VITE_API_URL=http://localhost:8000
    VITE_FRONT_URL=http://localhost:5173

    ```

6. **Run the frontend development server**:

    If you're using NPM:

    ```bash
    npm run dev
    ```

    Or, if you're using Yarn:

    ```bash
    yarn dev
    ```

   The React frontend should now be running at `http://localhost:5173` (by default).

## Running Both Services

- **Backend**: Make sure the Laravel server is running by using `php artisan serve`.
- **Frontend**: Ensure the React development server is running using `npm run dev` or `yarn dev`.

The frontend should be able to interact with the backend API at `http://localhost:8000`.

---
