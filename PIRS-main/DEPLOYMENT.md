# PIRS — Deployment Guide

Step-by-step instructions for deploying the PIRS backend and frontend to free cloud platforms.

---

## Table of Contents

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Platform Overview](#2-platform-overview)
3. [Database — Supabase (Free PostgreSQL)](#3-database--supabase-free-postgresql)
4. [Backend — Render](#4-backend--render)
5. [Frontend — Vercel](#5-frontend--vercel)
6. [Alternative: Full Stack on Railway](#6-alternative-full-stack-on-railway)
7. [Alternative: Frontend on Netlify](#7-alternative-frontend-on-netlify)
8. [Connecting Frontend to Backend](#8-connecting-frontend-to-backend)
9. [Post-Deployment Steps](#9-post-deployment-steps)
10. [Environment Variables Reference](#10-environment-variables-reference)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Pre-Deployment Checklist

Complete these steps before deploying to any platform.

### Backend fixes required

- [ ] **Fix `System.Device.dll` reference** — the current `PIRS.csproj` has a hardcoded path that only works on the original developer's machine. Replace it with a NuGet package:

  ```bash
  cd Backend/PIRS/PIRS
  dotnet add package GeoCoordinate.NetCore --version 1.0.0
  ```

  Remove this block from `PIRS.csproj`:
  ```xml
  <ItemGroup>
    <Reference Include="System.Device">
      <HintPath>..\..\..\..\..\..\..\apps\SET_UP\System.Device.dll</HintPath>
    </Reference>
  </ItemGroup>
  ```

  Update the using statement in `ReportController.cs`:
  ```csharp
  // Replace:
  using System.Device.Location;
  // With:
  using GeoCoordinatePortable;
  ```

- [ ] **Move the Chapa key to configuration** — open `TransactionController.cs` and replace:
  ```csharp
  Chapa chapa = new("CHASECK_TEST-rsh3UiMpIBytuEGhtyBPKtRU6ziR7Anj");
  ```
  With:
  ```csharp
  var chapaKey = _configuration["Chapa:SecretKey"];
  Chapa chapa = new(chapaKey);
  ```

- [ ] **Add JWT expiry** — in `AccountController.cs`, add `expires` to the token:
  ```csharp
  var token = new JwtSecurityToken(
      jwtIssuer, jwtAudience, claims,
      expires: DateTime.UtcNow.AddHours(8),
      signingCredentials: credentials
  );
  ```

- [ ] **Update CORS** — in `Program.cs`, add your deployed frontend URL:
  ```csharp
  builder.WithOrigins(
      "http://localhost:5173",
      "https://your-app.vercel.app"   // add this
  )
  ```

- [ ] **Update the database provider** (if using Supabase/PostgreSQL — see [Section 3](#3-database--supabase-free-postgresql))

### Frontend fix required

- [ ] **Centralize the API base URL** — add a `.env.production` file to `Frontend/`:
  ```
  VITE_API_BASE_URL=https://your-backend.onrender.com
  ```
  Then search for hardcoded `localhost` API calls and replace them with:
  ```js
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  ```

- [ ] **Build and test locally first:**
  ```bash
  cd Frontend
  npm run build
  npm run preview
  ```

---

## 2. Platform Overview

| Service | What to deploy | Free tier | Limitations |
|---|---|---|---|
| [Render](https://render.com) | Backend Web Service | Yes | Sleeps after 15 min idle; slow cold start (~30s) |
| [Vercel](https://vercel.com) | Frontend SPA | Yes | Excellent; no practical limits for React apps |
| [Supabase](https://supabase.com) | PostgreSQL database | Yes | 500 MB storage, 2 GB bandwidth/month |
| [Railway](https://railway.app) | Backend + Database | $5 credit/month | More flexible; backend + DB in one place |
| [Netlify](https://netlify.com) | Frontend SPA | Yes | Good alternative to Vercel |
| [Fly.io](https://fly.io) | Backend (Docker) | 3 free shared VMs | More setup required |
| [Azure SQL](https://azure.microsoft.com) | SQL Server database | Free for 12 months | Familiar SQL Server dialect |

**Recommended combination (completely free):**
- Database: **Supabase** (PostgreSQL)
- Backend: **Render** (Web Service)
- Frontend: **Vercel**

---

## 3. Database — Supabase (Free PostgreSQL)

Since `Microsoft.EntityFrameworkCore.SqlServer` requires a SQL Server instance (not freely available in the cloud), the recommended free option is to switch to **PostgreSQL via Supabase**.

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New project**, choose a name and region, set a database password
3. Wait for the project to provision (~1 minute)
4. Go to **Settings → Database** and copy the **Connection string** (URI format):
   ```
   postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

### Step 2 — Switch EF Core to PostgreSQL

In `Backend/PIRS/PIRS/`, install the Npgsql provider:

```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 6.0.22
dotnet remove package Microsoft.EntityFrameworkCore.SqlServer
```

Update `Program.cs`:

```csharp
// Replace:
options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection"))

// With:
options.UseNpgsql(builder.Configuration.GetConnectionString("MyConnection"))
```

Update the connection string in `appsettings.json`:

```json
"ConnectionStrings": {
  "MyConnection": "Host=db.xxx.supabase.co;Database=postgres;Username=postgres;Password=your-password"
}
```

### Step 3 — Re-generate migrations

```bash
dotnet ef migrations add InitialPostgres
dotnet ef database update
```

> If you get a `GeoCoordinate` error, make sure you completed the System.Device fix in the checklist first.

---

## 4. Backend — Render

### Step 1 — Push your code to GitHub

Make sure all the checklist items from [Section 1](#1-pre-deployment-checklist) are done and committed.

```bash
git add .
git commit -m "prepare for deployment"
git push origin main
```

### Step 2 — Create a Dockerfile

Create `Backend/PIRS/PIRS/Dockerfile`:

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "PIRS.csproj"
RUN dotnet publish "PIRS.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Create image directories
RUN mkdir -p wwwroot/Images/CompanyLogo wwwroot/Images/Report

EXPOSE 80
ENTRYPOINT ["dotnet", "PIRS.dll"]
```

Commit the Dockerfile:

```bash
git add Backend/PIRS/PIRS/Dockerfile
git commit -m "add Dockerfile for Render deployment"
git push
```

### Step 3 — Create a Render Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **New → Web Service**
3. Connect your GitHub account and select your PIRS repository
4. Configure the service:

   | Setting | Value |
   |---|---|
   | Name | `pirs-backend` |
   | Region | Closest to your users |
   | Branch | `main` |
   | Root Directory | `Backend/PIRS/PIRS` |
   | Runtime | **Docker** |
   | Instance Type | **Free** |

5. Click **Advanced** and add the following **Environment Variables**:

   | Key | Value |
   |---|---|
   | `ASPNETCORE_ENVIRONMENT` | `Production` |
   | `ASPNETCORE_URLS` | `http://+:80` |
   | `ConnectionStrings__MyConnection` | your Supabase connection string |
   | `Jwt__Key` | a long random secret (e.g., 64-char random string) |
   | `Jwt__Issuer` | `pirs-backend` |
   | `Jwt__Audience` | `pirs-frontend` |
   | `Chapa__SecretKey` | your Chapa live key |

   > Note: ASP.NET Core reads `ConnectionStrings__MyConnection` as `ConnectionStrings:MyConnection` — double underscores map to colons.

6. Click **Create Web Service**. Render will build and deploy the Docker container.

7. Once deployed, your API is live at: `https://pirs-backend.onrender.com`

### Step 4 — Run migrations on first deploy

Add a startup migration command by creating `Backend/PIRS/PIRS/start.sh`:

```bash
#!/bin/bash
dotnet ef database update --no-build
dotnet PIRS.dll
```

Update the Dockerfile to use it:

```dockerfile
COPY start.sh .
RUN chmod +x start.sh
ENTRYPOINT ["/bin/bash", "start.sh"]
```

Or run migrations manually once via the Render **Shell** tab:

```bash
dotnet ef database update
```

### Step 5 — Seed the roles

After the first deployment, call the role seeding endpoint:

```bash
curl https://pirs-backend.onrender.com/Role
```

---

## 5. Frontend — Vercel

### Step 1 — Add the environment file

Create `Frontend/.env.production`:

```
VITE_API_BASE_URL=https://pirs-backend.onrender.com
```

Update Axios calls in the frontend to use `import.meta.env.VITE_API_BASE_URL`.

Commit and push:

```bash
git add Frontend/.env.production
git commit -m "add production env config"
git push
```

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repository
4. Configure the project:

   | Setting | Value |
   |---|---|
   | Framework Preset | **Vite** |
   | Root Directory | `Frontend` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

5. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://pirs-backend.onrender.com` |

6. Click **Deploy**

Your frontend will be live at `https://pirs-[your-username].vercel.app`.

### Step 3 — Update backend CORS

Go back to your Render service environment variables and update `AllowedOrigins` (or update `Program.cs` directly):

```csharp
builder.WithOrigins(
    "http://localhost:5173",
    "https://pirs-yourname.vercel.app"
)
```

Redeploy the backend after this change.

---

## 6. Alternative: Full Stack on Railway

Railway supports backend and database in one place with $5/month of free credits.

### Step 1 — Create a Railway account

Go to [railway.app](https://railway.app) and sign in with GitHub.

### Step 2 — Create a new project

1. Click **New Project → Deploy from GitHub repo**
2. Select your PIRS repository

### Step 3 — Add a PostgreSQL database

In your Railway project:
1. Click **New → Database → Add PostgreSQL**
2. Railway provisions a database and gives you a `DATABASE_URL` environment variable automatically

### Step 4 — Configure the backend service

1. Click on the backend service
2. Set **Root Directory** to `Backend/PIRS/PIRS`
3. Railway will auto-detect the Dockerfile

4. Add environment variables:

   | Key | Value |
   |---|---|
   | `ASPNETCORE_URLS` | `http://+:$PORT` |
   | `ConnectionStrings__MyConnection` | copy from Railway's `DATABASE_URL` and reformat as Npgsql connection string |
   | `Jwt__Key` | your secret |
   | `Jwt__Issuer` | `pirs-backend` |
   | `Jwt__Audience` | `pirs-frontend` |

5. Deploy. Railway gives your service a URL like `https://pirs-production.up.railway.app`.

### Step 5 — Deploy the frontend to Vercel

Follow [Section 5](#5-frontend--vercel) using your Railway backend URL instead of Render's.

---

## 7. Alternative: Frontend on Netlify

If you prefer Netlify over Vercel:

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **Add new site → Import an existing project**
3. Connect GitHub and select your repo
4. Configure:

   | Setting | Value |
   |---|---|
   | Base directory | `Frontend` |
   | Build command | `npm run build` |
   | Publish directory | `Frontend/dist` |

5. Under **Site settings → Environment variables**, add:

   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://your-backend.onrender.com` |

6. Deploy.

### Handle client-side routing on Netlify

React Router uses client-side routing. Netlify needs a redirect rule to serve `index.html` for all paths. Create `Frontend/public/_redirects`:

```
/*  /index.html  200
```

---

## 8. Connecting Frontend to Backend

### The CORS requirement

The backend `Program.cs` has a hardcoded allowed origin. You **must** add your deployed frontend URL or all API calls will be blocked by the browser.

Update `Program.cs`:

```csharp
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        builder =>
        {
            builder.WithOrigins(
                "http://localhost:5173",
                "https://your-app.vercel.app",     // Vercel
                "https://your-app.netlify.app"      // Netlify (if applicable)
            )
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});
```

### Centralizing the API URL (frontend)

Create a config file at `Frontend/src/config.js`:

```js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export default API_BASE;
```

Import and use it in components:

```js
import API_BASE from '../config';

const response = await axios.get(`${API_BASE}/Report`);
```

---

## 9. Post-Deployment Steps

After both services are deployed and connected, run through this checklist:

- [ ] Visit `https://your-backend.onrender.com/swagger` — Swagger UI should load
- [ ] Call `GET /Role` once to seed the roles — check via Swagger
- [ ] Register a new user via the frontend sign-up page
- [ ] Log in and verify the JWT token is stored in localStorage
- [ ] Create a test report and confirm it appears in the report list
- [ ] Verify images upload and display correctly
- [ ] Test the upvote flow
- [ ] Test the company and contractor dashboards
- [ ] Test a transaction (use Chapa test mode credentials)

---

## 10. Environment Variables Reference

### Backend environment variables (Render / Railway)

| Variable | Example Value | Description |
|---|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` | Disables Swagger in production (review `Program.cs` if you want to keep it) |
| `ASPNETCORE_URLS` | `http://+:80` | Port to bind; use `http://+:$PORT` on Railway |
| `ConnectionStrings__MyConnection` | `Host=...;Database=...` | Database connection string |
| `Jwt__Key` | `super-secret-64-char-random-string` | JWT signing secret — keep this private |
| `Jwt__Issuer` | `pirs-backend` | JWT issuer |
| `Jwt__Audience` | `pirs-frontend` | JWT audience |
| `Chapa__SecretKey` | `CHASECK_LIVE-...` | Chapa payment gateway key |

### Frontend environment variables (Vercel / Netlify)

| Variable | Example Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://pirs-backend.onrender.com` | Backend API base URL |

> Vite only exposes variables prefixed with `VITE_` to the browser bundle.

---

## 11. Troubleshooting

### Backend cold start on Render free tier

Render free services spin down after 15 minutes of inactivity and take ~30 seconds to start back up. The first request after idle will be slow. To mitigate:
- Use [UptimeRobot](https://uptimerobot.com) to ping your API every 14 minutes (free tier available)
- Upgrade to a paid Render plan ($7/month) to disable sleep

---

### CORS errors in browser console

```
Access to XMLHttpRequest at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

Cause: Your frontend URL is not in the `WithOrigins(...)` list in `Program.cs`.

Fix: Add your exact deployed frontend URL to CORS config and redeploy the backend.

---

### `System.Device` build error on Render/Docker

```
error: Reference "System.Device" could not be resolved
```

Cause: The `HintPath` in `PIRS.csproj` points to a local file that doesn't exist in the Docker container.

Fix: Remove the `<Reference>` block and use the `GeoCoordinate.NetCore` NuGet package as described in [Section 1](#1-pre-deployment-checklist).

---

### EF Core migration fails on first run

```
There is already an object named 'AspNetUsers' in the database.
```

Cause: You applied migrations to a database that already has some tables.

Fix:

```bash
dotnet ef database drop --force
dotnet ef database update
```

Or mark the existing migration as applied:

```bash
dotnet ef migrations add EnsureClean --ignore-changes
dotnet ef database update
```

---

### Images not persisting after redeploy on Render

Cause: Render's free tier uses an ephemeral filesystem. Files written to disk are wiped on each deploy.

Fix: Integrate Cloudinary for image storage.

1. Install the SDK:
   ```bash
   dotnet add package CloudinaryDotNet --version 1.25.0
   ```

2. In `appsettings.json`:
   ```json
   "Cloudinary": {
     "CloudName": "your-cloud-name",
     "ApiKey": "your-api-key",
     "ApiSecret": "your-api-secret"
   }
   ```

3. Replace `System.IO.File` save logic in `ReportController.cs` and `ImagesController.cs` with Cloudinary upload calls, and store the returned URL in the database instead of a local path.

---

### 404 on page refresh (frontend on Netlify)

Cause: Netlify serves the `dist/` folder as static files. Navigating to `/trending` directly looks for a file `dist/trending/index.html`, which doesn't exist.

Fix: Add `Frontend/public/_redirects`:

```
/*  /index.html  200
```

Vercel handles this automatically via its framework preset.

---

### Swagger not loading in production

`Program.cs` conditionally shows Swagger only in development:

```csharp
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
```

To enable Swagger in production for testing (not recommended for sensitive APIs):

```csharp
app.UseSwagger();
app.UseSwaggerUI();
```

Or set `ASPNETCORE_ENVIRONMENT=Development` in your Render environment variables.
