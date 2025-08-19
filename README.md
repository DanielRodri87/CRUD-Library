# README.md

# Supabase Express App

This project is a Node.js application using Express to interact with a Supabase database. It provides a backend service for inserting data into a Supabase table.

## Project Structure

```
supabase-express-app
├── src
│   ├── app.ts                # Entry point of the application
│   ├── config
│   │   └── supabase.ts       # Supabase client configuration
│   ├── controllers
│   │   └── dataController.ts  # Controller for handling data operations
│   ├── routes
│   │   └── api.ts            # API routes setup
│   └── types
│       └── index.ts          # Type definitions for data structures
├── .env                       # Environment variables
├── package.json               # NPM configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                  # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd supabase-express-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_KEY=<your-supabase-key>
   ```

4. Run the application:
   ```
   npm start
   ```

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Example API Usage

Insert a new book:
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "The Great Gatsby",
    "autor": "F. Scott Fitzgerald",
    "num_pag": 180,
    "ano_pub": 1925
  }'
```

Or using Postman:
1. Method: POST
2. URL: http://localhost:3000/api/books
3. Headers: Content-Type: application/json
4. Body (raw JSON):
```json
{
    "titulo": "Dom Casmurro",
    "autor": "Machado de Assis",
    "num_pag": 256,
    "ano_pub": 1899
}
```

## License

This project is licensed under the MIT License.