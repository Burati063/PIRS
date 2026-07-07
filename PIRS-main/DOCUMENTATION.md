# PIRS — System Documentation

Full technical reference for the Public Infrastructure Reporting System.

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Tech Stack](#2-tech-stack)
3. [Data Models](#3-data-models)
4. [API Reference](#4-api-reference)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Frontend Routes](#6-frontend-routes)
7. [Image Handling](#7-image-handling)
8. [Payment Integration](#8-payment-integration)
9. [Rate Limiting](#9-rate-limiting)
10. [Configuration Reference](#10-configuration-reference)
11. [Running Locally](#11-running-locally)
12. [Known Limitations](#12-known-limitations)

---

## 1. System Architecture

```
┌─────────────────────────────┐
│    Browser (React + Vite)   │
│    http://localhost:5173    │
└──────────────┬──────────────┘
               │ HTTP/JSON  (Axios)
               │ multipart/form-data (file uploads)
               ▼
┌─────────────────────────────┐
│  ASP.NET Core 6 Web API     │
│  http://localhost:5xxx      │
│                             │
│  ┌─────────────────────┐    │
│  │  ASP.NET Identity   │    │
│  │  JWT Authentication │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │  EF Core 6          │    │
│  │  (Repository layer) │    │
│  └──────────┬──────────┘    │
│             │               │
│  ┌──────────▼──────────┐    │
│  │  SQL Server         │    │
│  │  (PirsDb)           │    │
│  └─────────────────────┘    │
│                             │
│  wwwroot/Images/            │
│  (static file server)       │
└─────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Chapa Payment Gateway      │
│  (external API)             │
└─────────────────────────────┘
```

The frontend and backend are **independently deployable** units that communicate over REST. The backend also serves uploaded image files as static assets from `wwwroot/Images/`.

### Request Flow

1. User fills a form in the React app
2. Axios sends an HTTP request to the backend API (with JWT token in the `Authorization` header for protected routes)
3. The controller validates input, calls the repository layer
4. The repository uses EF Core to read/write to SQL Server
5. The controller returns JSON to the frontend
6. For file uploads, files are saved to `wwwroot/Images/` and the path is stored in the database

---

## 2. Tech Stack

### Backend — `Backend/PIRS/PIRS/`

| Package | Version | Purpose |
|---|---|---|
| ASP.NET Core | 6.0 | Web API framework |
| Entity Framework Core | 6.0.23 | ORM and database migrations |
| Microsoft.AspNetCore.Identity.EntityFrameworkCore | 6.0 | User management, roles, password hashing |
| Microsoft.AspNetCore.Authentication.JwtBearer | 6.0 | JWT token validation middleware |
| Swashbuckle.AspNetCore | 6.5 | Swagger / OpenAPI documentation UI |
| AspNetCoreRateLimit | 5.0 | IP-based request rate limiting |
| Chapa.NET | 2.1 | Ethiopian payment gateway SDK |
| System.Device | — | GeoCoordinate for distance-based report sorting |

### Frontend — `Frontend/`

| Package | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| Vite | 5.0 | Build tool and HMR dev server |
| react-router-dom | 6.21 | Client-side routing |
| @mui/material | 5.15 | Component library (buttons, tables, dialogs) |
| @mui/x-data-grid | 6.19 | Data grid for reports/transactions |
| @mui/x-charts | 6.19 | Charts for dashboards |
| react-leaflet / leaflet | 4.2 / 1.9 | Interactive map for location picking and display |
| axios | 1.6 | HTTP client |
| i18next / react-i18next | 23 / 14 | Internationalization |
| bootstrap / react-bootstrap | 5.3 / 2.10 | Utility CSS and layout components |

---

## 3. Data Models

### AppUser

Extends `IdentityUser` from ASP.NET Identity. Shared across all three roles.

| Field | Type | Description |
|---|---|---|
| `Id` | `string` | Auto-generated GUID (from IdentityUser) |
| `UserName` | `string` | Login username (from IdentityUser) |
| `Email` | `string` (unique) | User email (from IdentityUser) |
| `PasswordHash` | `string` | Bcrypt hash (from IdentityUser) |
| `PhoneNumber` | `string?` | Contact number |
| `Name` | `string?` | Display name |
| `Logo` | `string?` | Relative path to uploaded company logo (Company role) |
| `Formula` | `string?` | Company description/formula (Company role) |
| `HiringCompanyId` | `string?` | ID of the company that hired this contractor (Contractor role) |

**Roles:** `User`, `Contractor`, `Company` (seeded via `RoleController`)

---

### Report

The core entity of the system.

| Field | Type | Description |
|---|---|---|
| `ReportId` | `int` | Auto-increment primary key |
| `Title` | `string` | Short issue title |
| `Description` | `string` | Full description of the problem |
| `DateTime` | `DateTime` | When the report was submitted |
| `status` | `ReportStatus` (enum) | Current resolution status |
| `awardAmount` | `decimal` | Payment offered to the contractor for resolution |
| `location` | `Location` | Embedded geo location |
| `pictures` | `List<ImageGallery>` | Attached photos |
| `upvotes` | `List<ReportUpvote>` | Citizens who upvoted this report |
| `User` | `AppUser` | Citizen who submitted the report |
| `Company` | `AppUser?` | Company that owns the report |
| `Contractor` | `AppUser?` | Contractor assigned to resolve it |

**ReportStatus enum:**
```
Pending    = 0   (default, just submitted)
InProgress = 1   (contractor assigned)
Resolved   = 2   (issue fixed)
```

---

### Location

Embedded in `Report`.

| Field | Type | Description |
|---|---|---|
| `Id` | `int` | PK |
| `Latitude` | `double` | GPS latitude |
| `Longitude` | `double` | GPS longitude |
| `Address` | `string?` | Human-readable address |

---

### ImageGallery

One row per uploaded photo, linked to a Report.

| Field | Type | Description |
|---|---|---|
| `Id` | `int` | PK |
| `Image` | `string` | Relative path under `wwwroot/` |

---

### ReportUpvote

Many-to-many link between users and reports (upvotes).

| Field | Type | Description |
|---|---|---|
| `Id` | `int` | PK |
| `User` | `AppUser` | User who upvoted |

---

### Transaction

Records a payment from a Company to a Contractor for resolving a Report.

| Field | Type | Description |
|---|---|---|
| `Id` | `int` | PK |
| `Payment` | `decimal` | Amount paid |
| `DateTime` | `DateTime` | When the transaction occurred |
| `Company` | `AppUser` | Paying company |
| `Contractor` | `AppUser` | Receiving contractor |
| `Report` | `Report` | The resolved report this payment is for |

---

### DTOs (Data Transfer Objects)

The API accepts and returns DTOs to decouple the HTTP layer from the EF entity models.

- `ReportDto<T>` — generic DTO where `T` is either `IFormFile` (incoming) or `ImageGallery` (outgoing)
- `TransactionDto` — flat version of Transaction with IDs instead of navigation properties
- `AppUserDto` — user profile data
- `ReportUpvoteDto` — upvote with user ID

---

## 4. API Reference

Base URL: `http://localhost:5000` (development). All routes are relative to this.

Protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

### `/Account` — Authentication

#### `POST /Account/signup`

Register a new user. Sends credentials as query parameters.

**Query params:**
- `roleName` — `User` | `Contractor` | `Company`
- `password` — plain text (hashed server-side)

**Body:** `AppUser` JSON object

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "userName": "johndoe",
  "phoneNumber": "0912345678"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": { ... }
}
```

---

#### `POST /Account/login`

Login with email and password.

**Query params:**
- `email`
- `password`

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": { ... },
  "role": "User"
}
```

---

### `/User` — User Management

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/User` | No | Create a user (without login) |
| `GET` | `/User` | No | List all users in the `User` role |
| `GET` | `/User/{id}` | No | Get a single user by ID |
| `PUT` | `/User/{id}` | No | Update a user's profile |
| `DELETE` | `/User/{id}` | No | Delete a user |
| `GET` | `/User/users-with-roles?roleName=Contractor` | No | Get users in a specific role |

---

### `/Report` — Report CRUD

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/Report` | No | Get all reports |
| `GET` | `/Report/{id}` | **Yes** | Get a single report by ID |
| `POST` | `/Report` | No | Create a report (`multipart/form-data`) |
| `PUT` | `/Report` | **Yes** | Update a report (`multipart/form-data`) |
| `DELETE` | `/Report?id={id}` | **Yes** | Delete a report and its images |
| `POST` | `/Report/Upvote?reportId={id}&userId={uid}` | No | Add an upvote |
| `DELETE` | `/Report/Upvote?reportId={id}&upvoteId={vid}` | No | Remove an upvote |
| `PUT` | `/Report/UpdateStatus?reportId={id}&status={s}&contractorId={cid}` | No | Assign contractor and update status |
| `GET` | `/Report/GetByContractor?id={id}` | No | Reports assigned to a contractor |
| `GET` | `/Report/GetByUser?id={id}` | No | Reports created by a user |
| `GET` | `/Report/GetByCompany?id={id}&reportStatus={s}` | No | Reports for a company filtered by status |
| `GET` | `/Report/GetByLocation?Latitude={lat}&Longitude={lng}` | No | Reports near a location |
| `GET` | `/Report/Sort?CompanyId={id}&Status={s}&GeoCoordinate.Latitude={lat}&GeoCoordinate.Longitude={lng}` | No | Sort/filter reports by multiple criteria |

**Creating/updating a report** uses `multipart/form-data` to support file uploads alongside JSON fields.

---

### `/Images` — File Serving and Upload

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/Images?id={filename}` | No | Serve an image file by filename |
| `POST` | `/Images/PostCompanyLogo?id={userId}` | No | Upload a new company logo |
| `PUT` | `/Images/PutCompanyLogo?id={userId}` | No | Replace an existing company logo |

Images are stored under `wwwroot/Images/CompanyLogo/` and `wwwroot/Images/Report/`.
To display an image: `GET /Images?id=CompanyLogo/filename.jpg`

---

### `/Transaction` — Payments

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/Transaction` | No | Initiate Chapa payment and record transaction |
| `GET` | `/Transaction/GetById/{id}` | No | Get a transaction by ID |
| `GET` | `/Transaction/GetAll` | No | Get all transactions |
| `GET` | `/Transaction/GetAllByContractor/{contractorId}` | No | Transactions received by a contractor |
| `GET` | `/Transaction/GetAllByCompany/{companyId}` | No | Transactions sent by a company |

**Transaction creation** calls the Chapa API to initialize a payment and redirects to the Chapa-hosted payment page. On success, the transaction is recorded in the database.

---

### `/Role` — Role Seeding

Seeds the three roles (`User`, `Contractor`, `Company`) into the `AspNetRoles` table. Call once after first migration.

---

## 5. Authentication & Authorization

PIRS uses **JWT Bearer tokens** issued by the backend after login or signup.

### Token contents

The JWT payload contains two claims:
- `ClaimTypes.Name` — the user's display name
- `ClaimTypes.Role` — the user's role (`User`, `Contractor`, or `Company`)

### Token configuration (`appsettings.json`)

```json
"Jwt": {
  "Issuer": "pirs-backend",
  "Audience": "pirs-frontend",
  "Key": "your-secret-key"
}
```

### Frontend storage

The frontend stores the token in `localStorage` under the `AuthInfo` key. Routes check `localStorage.getItem('AuthInfo') == "true"` to gate authenticated pages.

### Important security note

JWT tokens are currently issued **without an expiry**. Any issued token is valid forever until the signing key changes. Set a `expires` value in `AccountController.cs` before production use:

```csharp
var token = new JwtSecurityToken(
    jwtIssuer,
    jwtAudience,
    claims,
    expires: DateTime.UtcNow.AddHours(8),   // add this
    signingCredentials: credentials
);
```

---

## 6. Frontend Routes

Defined in `Frontend/src/App.jsx` using React Router DOM v6.

| Path | Component | Auth gate | Description |
|---|---|---|---|
| `/` | `Home` or `Trending` | No (redirects if logged in) | Landing page |
| `/Home` | `Home` | No | Public landing page |
| `/About` | `About` | No | About page |
| `/choosecreate` | `ChooseCreateAcc` | No | Account type selection |
| `/signupasuser` | `SignUpAsUser` | No | User registration form |
| `/signupascontractor` | `SignUpAsContractor` | No | Contractor registration form |
| `/signupascompany` | `SignUpAsCompany` | No | Company registration form |
| `/signinasuser` | `SignInAsUser` | No | Login form |
| `/udashboard` | `UDashboard` | No | User dashboard |
| `/createreport` | `CreateReport` | **Yes** (redirects to sign in) | New report form with map picker |
| `/reports` | `MyReports` | No | User's submitted reports |
| `/trending` | `Trending` | No | All reports sorted by upvotes |
| `/editreport/*` | `EditReport` | No | Edit an existing report |
| `/Company/*` | `Company` | No | Company portal |
| `/contdashboard` | `Layout` | No | Contractor dashboard shell |
| `/contdashboard/GetReportById` | `ContReports` | No | Contractor's assigned reports |
| `/contdashboard/profile` | `ContProfile` | No | Contractor profile |
| `/contdashboard/Transaction` | `ContTransaction` | No | Contractor transaction history |

---

## 7. Image Handling

### Upload flow

1. Client sends a `POST /Report` or `POST /Images/PostCompanyLogo` with `multipart/form-data`
2. The controller receives `IFormFile`
3. A GUID-prefixed filename is generated: `{Guid}_{originalName}.jpg`
4. The file is saved to `wwwroot/Images/Report/` or `wwwroot/Images/CompanyLogo/`
5. The relative path (e.g., `Images/Report/abc123_photo.jpg`) is stored in the database

### Serving images

```
GET /Images?id=Images/Report/abc123_photo.jpg
```

The controller opens the file from `wwwroot` and returns it with the correct MIME type.

### File size limit

`ReportController` has a 100 MB request size limit:
```csharp
[RequestSizeLimit(100_000_000)]
```

### Production note

`wwwroot` is an **ephemeral filesystem** on most free cloud platforms (Render, Railway, Fly.io). Uploaded files will be lost on redeploy. For production, switch to a cloud storage provider:

- [Cloudinary](https://cloudinary.com) — free 25 GB, easy SDK
- [AWS S3](https://aws.amazon.com/s3/) — 5 GB free tier
- [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs/) — 5 GB free

---

## 8. Payment Integration

PIRS integrates with [Chapa](https://chapa.co), an Ethiopian payment gateway.

### Flow

1. Company creates a transaction via `POST /Transaction` with the contractor ID, report ID, and payment amount
2. The backend calls `ChapaRequest` with payment details
3. Chapa returns a checkout URL
4. The user is redirected to Chapa's hosted payment page
5. On success, the transaction is recorded in the database

### Configuration

The Chapa secret key is currently hardcoded in `TransactionController.cs`:

```csharp
Chapa chapa = new("CHASECK_TEST-rsh3UiMpIBytuEGhtyBPKtRU6ziR7Anj");
```

**Before production**, move this to `appsettings.json` or an environment variable:

```json
"Chapa": {
  "SecretKey": "CHASECK_LIVE-your-real-key"
}
```

```csharp
var chapaKey = _configuration["Chapa:SecretKey"];
Chapa chapa = new(chapaKey);
```

---

## 9. Rate Limiting

The API uses `AspNetCoreRateLimit` to limit requests per IP address.

Default rules (configured in `appsettings.json`):

| Period | Limit |
|---|---|
| 1 second | 10 requests |
| 15 minutes | 200 requests |

Exceeding the limit returns `HTTP 429 Too Many Requests`.

To adjust rules, edit the `IpRateLimiting.GeneralRules` section in `appsettings.json`:

```json
"GeneralRules": [
  { "Endpoint": "*", "Period": "1s",  "Limit": 10 },
  { "Endpoint": "*", "Period": "15m", "Limit": 200 }
]
```

---

## 10. Configuration Reference

### `Backend/PIRS/PIRS/appsettings.json`

```json
{
  "ConnectionStrings": {
    "MyConnection": "server=.;database=PirsDb;trusted_connection=true;"
  },
  "Jwt": {
    "Issuer": "pirs-backend",
    "Audience": "pirs-frontend",
    "Key": "change-this-to-a-long-random-secret"
  },
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": false,
    "StackBlockedRequests": false,
    "HttpStatusCode": 429,
    "GeneralRules": [
      { "Endpoint": "*", "Period": "1s",  "Limit": 10  },
      { "Endpoint": "*", "Period": "15m", "Limit": 200 }
    ]
  }
}
```

| Key | Default | Notes |
|---|---|---|
| `ConnectionStrings:MyConnection` | local SQL Server | Use environment variable override in production |
| `Jwt:Key` | `0f6h41234567043rieofkdl` | **Must be changed** — minimum 32 characters recommended |
| `Jwt:Issuer` | `pirs-backend` | Must match `ValidIssuer` in `Program.cs` |
| `Jwt:Audience` | `pirs-frontend` | Must match `ValidAudience` in `Program.cs` |

### CORS

Configured in `Program.cs` to allow the frontend origin. Update for production:

```csharp
builder.WithOrigins("https://your-deployed-frontend.vercel.app")
```

---

## 11. Running Locally

### Prerequisites

| Tool | Download |
|---|---|
| .NET 6 SDK | https://dotnet.microsoft.com/download/dotnet/6.0 |
| SQL Server (Express) | https://www.microsoft.com/en-us/sql-server/sql-server-downloads |
| Node.js 18+ | https://nodejs.org |
| dotnet-ef CLI | `dotnet tool install --global dotnet-ef --version 6.*` |

---

### Backend Setup

**Step 1 — Clone and navigate:**

```bash
git clone https://github.com/your-username/PIRS.git
cd PIRS/Backend/PIRS/PIRS
```

**Step 2 — Update `appsettings.json`** with your SQL Server connection string:

```json
"ConnectionStrings": {
  "MyConnection": "server=localhost;database=PirsDb;trusted_connection=true;"
}
```

If using username/password auth instead of Windows auth:
```
"server=localhost;database=PirsDb;user id=sa;password=YourPassword;"
```

**Step 3 — Create the image directories:**

```cmd
mkdir wwwroot\Images\CompanyLogo
mkdir wwwroot\Images\Report
```

**Step 4 — Apply EF Core migrations:**

```bash
dotnet ef database update
```

**Step 5 — Run the API:**

```bash
dotnet run
```

The API starts at `https://localhost:7xxx` (check terminal for exact port).
Swagger UI: `https://localhost:7xxx/swagger`

**Step 6 — Seed the roles:**

Call `GET /Role` once (via Swagger or curl) to create the User, Contractor, and Company roles in the database.

```bash
curl -X GET https://localhost:7xxx/Role -k
```

---

### Frontend Setup

**Step 1 — Navigate to the frontend folder:**

```bash
cd Frontend
```

**Step 2 — Install dependencies:**

```bash
npm install
```

**Step 3 — Update the API base URL** in your Axios calls to match your backend port. Search for hardcoded `localhost` URLs in the `src/` folder:

```bash
# Windows
findstr /s /i "localhost" src\*.jsx src\**\*.jsx
```

Update them to match your backend port (e.g., `http://localhost:5000`).

**Step 4 — Start the dev server:**

```bash
npm run dev
```

App runs at `http://localhost:5173`.

> The backend CORS policy already allows `http://localhost:5173`.

---

### Fix: System.Device Reference

The `PIRS.csproj` file contains a hardcoded local path to `System.Device.dll`:

```xml
<Reference Include="System.Device">
  <HintPath>..\..\..\..\..\..\..\apps\SET_UP\System.Device.dll</HintPath>
</Reference>
```

This will fail on any machine other than the original developer's. Fix it by installing the NuGet package instead:

```bash
dotnet add package GeoCoordinate.NetCore --version 1.0.0
```

Then update the `using` statement in `ReportController.cs`:
```csharp
using GeoCoordinatePortable;  // instead of System.Device.Location
```

And remove the `<Reference>` block from `PIRS.csproj`.

---

## 12. Known Limitations

| Issue | Location | Fix |
|---|---|---|
| JWT tokens never expire | `AccountController.cs` | Add `expires: DateTime.UtcNow.AddHours(8)` to token creation |
| Hardcoded Chapa test API key | `TransactionController.cs` | Move to `appsettings.json` / environment variable |
| `System.Device.dll` hardcoded path | `PIRS.csproj` | Replace with `GeoCoordinate.NetCore` NuGet package |
| Images stored on local filesystem | `wwwroot/Images/` | Migrate to Cloudinary, S3, or Azure Blob for production |
| CORS allows only `localhost:5173` | `Program.cs` | Add deployed frontend URL before deploying |
| Roles not automatically seeded | `RoleController` | Add startup migration seeding or call `/Role` once manually |
| No token refresh mechanism | — | Implement refresh token flow for long-lived sessions |
