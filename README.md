# Express Template

A simple Express.js template with authentication, email verification, and essential backend features. This template provides a solid foundation for building scalable REST APIs with modern best practices.

## Features

- 🔐 **Complete Authentication System**
  - User registration with modular validation
  - Secure login with JWT tokens
  - Email verification workflow with EJS templates
  - Password reset with 6-digit verification codes
- 📧 **Email Integration** with Nodemailer and custom templates
- 🛡️ **Security Features**
  - Password hashing with bcryptjs
  - JWT-based authentication middleware
  - Comprehensive input validation system
- 🗄️ **Database Integration** with Prisma ORM and migrations
- 📝 **Email Templates** with EJS for verification and password reset
- 🔄 **CORS** enabled for cross-origin requests
- 📋 **Modular Validation System** 
  - Reusable validation rules (email, password, confirmPassword, username)
  - User-specific validators (registration, email, password change)
- ⚡ **Development Tools**
  - Auto-restart with Nodemon
  - Database migrations with Prisma
  - Code generation utilities

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database ORM**: Prisma v6.13.0
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcryptjs
- **Email Service**: Nodemailer
- **Template Engine**: EJS
- **Validation**: express-validator
- **Environment Variables**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Database (PostgreSQL, MySQL, SQLite, or MongoDB)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd express-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your_database_connection_string"
   
   # JWT Authentication
   JWT_SECRET="your_jwt_secret_key"
   
   # Server Configuration
   SERVER_URL="http://localhost:3000"
   CLIENT_URL="http://localhost:3000"
   
   # SMTP Email Configuration
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your_email@gmail.com"
   SMTP_PASS="your_app_password"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

## Usage

### Development

Start the development server with auto-restart:
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### Production

For production deployment:
```bash
npm start
```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user |
| POST | `/api/forgot-password` | Request password reset |
| POST | `/api/verify-code` | Verify reset code |
| PUT | `/api/reset-password` | Reset password with verified code |
| POST | `/api/verify-email` | Send email verification |
| GET | `/api/verify-email/:verificationToken` | Verify email with token |

### Request Examples

**Register User**
```json
POST /api/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "username": "admin"
}
```

**Login**
```json
POST /api/login
{
  "username": "admin",
  "password": "securePassword123"
}
```

**Forgot Password**
```json
POST /api/forgot-password
{
  "email": "user@example.com"
}
```

**Verify Reset Code**
```json
POST /api/verify-code
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Reset Password**
```json
PUT /api/reset-password
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
  "password": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Send Email Verification**
```json
POST /api/verify-email
{
  "email": "user@example.com"
}
```

## Project Structure

```
express-template/
├── app.js                     # Application entry point
├── controllers/               # Route controllers
│   └── guest/                # Guest authentication controllers
│       ├── forgotPasswordController.js
│       ├── loginController.js
│       ├── registerController.js
│       ├── resetPasswordController.js
│       ├── verifyEmailController.js
│       └── verifyResetCodeController.js
├── generated/                 # Auto-generated Prisma client
│   └── prisma/               # Prisma client files
├── middlewares/              # Custom middleware
│   └── authMiddleware.js     # JWT authentication middleware
├── prisma/                   # Database configuration
│   ├── migrations/           # Database migration files
│   └── schema.prisma        # Database schema definition
├── routes/                   # API route definitions
│   └── guestRouter.js       # Guest authentication routes
├── utils/                    # Utility functions
│   ├── generateSixDigitCode.js  # Generate verification codes
│   └── setExpiry.js         # Set token expiration times
├── validators/               # Validation system
│   ├── rules/               # Reusable validation rules
│   │   ├── confirmPassword.js
│   │   ├── email.js
│   │   ├── password.js
│   │   └── username.js
│   └── user/                # User-specific validations
│       ├── email.js
│       ├── passwordChange.js
│       └── registration.js
├── views/                    # EJS templates
│   └── emails/              # Email templates
│       ├── resetPassword.ejs
│       └── verifyEmail.ejs
├── package.json
├── package-lock.json
└── README.md
```

## Validation System

The template features a comprehensive modular validation system:

### Reusable Validation Rules (`validators/rules/`)
- **email.js**: Email format and domain validation
- **password.js**: Password strength requirements
- **confirmPassword.js**: Password confirmation matching
- **username.js**: Username format and length validation

### User-Specific Validators (`validators/user/`)
- **registration.js**: Complete user registration validation
- **email.js**: Email-related operation validations
- **passwordChange.js**: Password change and reset validations

### Utility Functions (`utils/`)
- **generateSixDigitCode.js**: Creates secure 6-digit verification codes
- **setExpiry.js**: Manages token and code expiration times

## Security Features

- **Password Hashing**: Uses bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation with express-validator
- **CORS Protection**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored securely

## Database Schema

The template uses Prisma ORM with a flexible schema. Example User model:

```prisma
model User {
  id            Int      @id @default(autoincrement())
  username      String   @unique
  email         String   @unique
  emailVerified Boolean  @default(false)
  password      String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  Otp           Otp[]
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `SERVER_URL` | Backend server URL | Yes |
| `CLIENT_URL` | Frontend client URL | Yes |
| `SMTP_HOST` | SMTP server host | Yes |
| `SMTP_PORT` | SMTP server port | Yes |
| `SMTP_USER` | SMTP username/email | Yes |
| `SMTP_PASS` | SMTP password/app password | Yes |

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (configure as needed)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, bagasbas.nethangabriel@gmail.com or create an issue in the repository.

---

**Built with ❤️**
