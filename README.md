# Law Practice Management API

A RESTful API for managing law practice operations, built with Node.js, Express, TypeScript, and PostgreSQL.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd law-practice/api
```

2. Start the services using Docker Compose:

```bash
$ docker-compose up -d
```

This will start:

- PostgreSQL database on port 5432
- API server on port 3001

3. The API will be available at `http://localhost:3001`

4. To seed the database with a demo user do:

```
$ npx sequelize-cli db:seed:all
```

A user with email: `test@test.com` and password: `12345678` will be created.
You can also signup from the UI the first time time.

## Local development

Install dependencies:

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install project dependencies
pnpm install

# Start the development server
pnpm dev
```

The development server will start on port 3001 with hot-reloading enabled.

## Testing

The project uses Jest as the testing framework. Tests are located in the `tests` directory and follow the same structure as the source code.

### Running Tests

To run all tests:

```bash
pnpm test
```

To run tests in watch mode (useful during development):

```bash
pnpm test -- --watch
```

To run a specific test file:

```bash
pnpm test -- tests/controllers/authController.test.ts
```

### Test Structure

- `tests/setup.ts`: Contains test setup and mock utilities
- `tests/controllers/`: Tests for API controllers
- `tests/middleware/`: Tests for middleware functions

### Writing Tests

When writing new tests:

1. Create a new test file in the appropriate directory under `tests/`
2. Use the mock utilities from `tests/setup.ts`
3. Follow the existing test patterns
4. Make sure to mock external dependencies (database, JWT, etc.)

Example test structure:

```typescript
describe("Feature", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  it("should do something", async () => {
    // Test implementation
  });
});
```

## API Routes

### Authentication

#### Register a new user

- **POST** `/api/auth/signup`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string (min 6 characters)",
    "firmName": "string"
  }
  ```

#### Login

- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### Get current user

- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

### Customers

#### Get all customers

- **GET** `/api/customers`
- **Headers:** `Authorization: Bearer <token>`

#### Create a new customer

- **POST** `/api/customers`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "string",
    "phoneNumber": "string",
    "email": "string (optional)",
    "address": "string (optional)",
    "notes": "string (optional)"
  }
  ```

#### Get customer by ID

- **GET** `/api/customers/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Update customer

- **PUT** `/api/customers/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same as create customer (all fields optional)

#### Delete customer

- **DELETE** `/api/customers/:id`
- **Headers:** `Authorization: Bearer <token>`

### Matters

#### Get all matters for a customer

- **GET** `/api/customers/:customerId/matters`
- **Headers:** `Authorization: Bearer <token>`

#### Create a new matter

- **POST** `/api/customers/:customerId/matters`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "practiceArea": "string",
    "status": "string (optional, defaults to 'Open')"
  }
  ```

#### Get matter details

- **GET** `/api/customers/:customerId/matters/:matterId`
- **Headers:** `Authorization: Bearer <token>`

## Environment Variables

The following environment variables are configured in the Docker Compose file:

- `NODE_ENV`: Development environment
- `PORT`: API server port (3001)
- `JWT_SECRET`: Secret for JWT token generation
- `JWT_EXPIRE`: JWT token expiration time (30d)
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password

## Development

The API server runs in development mode with hot-reloading enabled. Any changes to the source code will automatically restart the server.

## Stopping the Services

To stop all services:

```bash
docker-compose down
```

To stop and remove all data (including the database volume):

```bash
docker-compose down -v
```
