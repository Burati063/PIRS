# PIRS — Free Deployment Guide

Deploy the PIRS backend and frontend completely free using:
- **Supabase** — free PostgreSQL database
- **Render** — free backend hosting
- **Vercel** — free frontend hosting

---

## What You Need Before Starting

- A [GitHub](https://github.com) account
- Your PIRS project pushed to a GitHub repository
- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0) installed locally
- [Node.js 18+](https://nodejs.org) installed locally

---

## Step 1 — Fix the Code (Required Before Deploying)

These bugs will break the deployment if not fixed first.

### Fix 1 — Replace the broken System.Device reference

Open `Backend/PIRS/PIRS/PIRS.csproj` and **delete** this block:

```xml
<ItemGroup>
  <Reference Include="System.Device">
    <HintPath>..\..\..\..\..\..\..\apps\SET_UP\System.Device.dll</HintPath>
  </Reference>
</ItemGroup>
```

Then run:

```bash
cd Backend/PIRS/PIRS
dotnet add package GeoCoordinate.NetCore --version 1.0.0
```

Open `Backend/PIRS/PIRS/Controllers/ReportController.cs` and replace:

```csharp
using System.Device.Location;
```

with:

```csharp
using GeoCoordinatePortable;
```

---

### Fix 2 — Move the Chapa key to config

Open `Backend/PIRS/PIRS/Controllers/TransactionController.cs` and replace:

```csharp
Chapa chapa = new("CHASECK_TEST-rsh3UiMpIBytuEGhtyBPKtRU6ziR7Anj");
```

with:

```csharp
var chapaKey = _configuration["Chapa:SecretKey"];
Chapa chapa = new(chapaKey);
```

Make sure `IConfiguration _configuration` is injected in the constructor.

---

### Fix 3 — Switch database from SQL Server to PostgreSQL

The free Supabase database uses PostgreSQL. You need to swap the EF Core provider.

```bash
cd Backend/PIRS/PIRS
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 6.0.22
dotnet remove package Microsoft.EntityFrameworkCore.SqlServer
```

Open `Program.cs` and replace:

```csharp
options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection"))
```

with:

```csharp
options.UseNpgsql(builder.Configuration.GetConnectionString("MyConnection"))
```

---

### Fix 4 — Update CORS to allow your future frontend URL

Open `Program.cs` and find the CORS section. Add a placeholder for now (you will update this after Vercel deploys):

```csharp
builder.WithOrigins(
    "http://localhost:5173",
    "https://YOUR_APP.vercel.app"   // update after Vercel deploy
)
.AllowAnyMethod()
.AllowAnyHeader();
```

---

### Fix 5 — Add JWT token expiry

Open `Backend/PIRS/PIRS/Controllers/AccountController.cs` and add `expires` to the token:

```csharp
var token = new JwtSecurityToken(
    jwtIssuer,
    jwtAudience,
    claims,
    expires: DateTime.UtcNow.AddHours(8),   // add this line
    signingCredentials: credentials
);
```

---

### Fix 6 — Add frontend environment variable support

Create a new file: `Frontend/.env.production`

```
VITE_API_BASE_URL=https://YOUR_BACKEND.onrender.com
```

> You will fill in the real Render URL after Step 3. For now just create the file with a placeholder.

Then in your frontend components, replace any hardcoded `http://localhost:5000` with:

```js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

---

### Commit everything

```bash
git add .
git commit -m "fix: prepare project for free deployment"
git push origin main
```

---

## Step 2 — Database on Supabase

### 2.1 Create a Supabase account

1. Go to [supabase.com](https://supabase.com) and click **Start your project**
2. Sign in with GitHub
3. Click **New project**
4. Fill in:
   - **Name:** `pirs-db`
   - **Database Password:** pick a strong password and save it somewhere
   - **Region:** pick the closest to your users
5. Click **Create new project** and wait about 1 minute for it to provision

### 2.2 Get the connection string

1. In your Supabase project, go to **Settings → Database**
2. Scroll down to **Connection string**
3. Select **URI** tab
4. Copy the string — it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the password you set in step 2.1

### 2.3 Run migrations against Supabase

Update your local `appsettings.json` temporarily with the Supabase connection string:

```json
"ConnectionStrings": {
  "MyConnection": "Host=db.xxxx.supabase.co;Database=postgres;Username=postgres;Password=your-password"
}
```

Then run:

```bash
cd Backend/PIRS/PIRS
dotnet ef migrations add InitialPostgres
dotnet ef database update
```

You should see tables appear in your Supabase dashboard under **Table Editor**.

> After this, revert `appsettings.json` — you will pass the connection string as an environment variable to Render instead of hardcoding it.

---

## Step 3 — Backend on Render

### 3.1 Create the Dockerfile

Create a new file at `Backend/PIRS/PIRS/Dockerfile` with this content:

```dockerfile
# ── Build stage ────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "PIRS.csproj"
RUN dotnet publish "PIRS.csproj" -c Release -o /app/publish

# ── Runtime stage ──────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Create folders for uploaded images
RUN mkdir -p wwwroot/Images/CompanyLogo wwwroot/Images/Report

EXPOSE 80
ENTRYPOINT ["dotnet", "PIRS.dll"]
```

Commit and push:

```bash
git add Backend/PIRS/PIRS/Dockerfile
git commit -m "add Dockerfile for Render"
git push
```

### 3.2 Create a Render account

1. Go to [render.com](https://render.com) and click **Get Started**
2. Sign up with GitHub

### 3.3 Create the Web Service

1. Click **New → Web Service**
2. Click **Connect account** to link GitHub, then select your PIRS repo
3. Fill in the settings:

   | Setting | Value |
   |---|---|
   | **Name** | `pirs-backend` |
   | **Region** | closest to your users |
   | **Branch** | `main` |
   | **Root Directory** | `Backend/PIRS/PIRS` |
   | **Runtime** | Docker |
   | **Instance Type** | Free |

4. Scroll down to **Environment Variables** and add:

   | Key | Value |
   |---|---|
   | `ASPNETCORE_ENVIRONMENT` | `Production` |
   | `ASPNETCORE_URLS` | `http://+:80` |
   | `ConnectionStrings__MyConnection` | `Host=db.xxx.supabase.co;Database=postgres;Username=postgres;Password=your-password` |
   | `Jwt__Key` | any long random string, e.g. `p1r5-s3cr3t-k3y-ch4ng3-m3-b3for3-d3ploy-2024` |
   | `Jwt__Issuer` | `pirs-backend` |
   | `Jwt__Audience` | `pirs-frontend` |
   | `Chapa__SecretKey` | your Chapa key (use test key for now) |

   > The double underscore `__` is how ASP.NET Core reads nested config from environment variables. `Jwt__Key` = `Jwt:Key` in appsettings.

5. Click **Create Web Service**

### 3.4 Wait for the build

Render will pull your code, build the Docker image, and deploy it. This takes 3–5 minutes on first run. Watch the build logs for any errors.

### 3.5 Verify the backend is live

Once the status shows **Live**, click the URL at the top of the page:

```
https://pirs-backend.onrender.com
```

Add `/swagger` to open the Swagger UI and confirm the API is running:

```
https://pirs-backend.onrender.com/swagger
```

### 3.6 Seed the roles

Call the role seeding endpoint once. You can do this directly in Swagger UI or via curl:

```bash
curl https://pirs-backend.onrender.com/Role
```

This creates the `User`, `Contractor`, and `Company` roles in the database.

---

## Step 4 — Frontend on Vercel

### 4.1 Update the production env file

Now that you have the real Render URL, update `Frontend/.env.production`:

```
VITE_API_BASE_URL=https://pirs-backend.onrender.com
```

Commit and push:

```bash
git add Frontend/.env.production
git commit -m "set production API URL"
git push
```

### 4.2 Create a Vercel account

1. Go to [vercel.com](https://vercel.com) and click **Sign Up**
2. Sign up with GitHub

### 4.3 Import the project

1. Click **Add New → Project**
2. Find your PIRS repository and click **Import**
3. Configure the project:

   | Setting | Value |
   |---|---|
   | **Framework Preset** | Vite |
   | **Root Directory** | `Frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
   | **Install Command** | `npm install` |

4. Expand **Environment Variables** and add:

   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://pirs-backend.onrender.com` |

5. Click **Deploy**

Vercel builds and deploys in about 1–2 minutes.

### 4.4 Get your Vercel URL

After deployment, Vercel gives you a URL like:

```
https://pirs-yourname.vercel.app
```

Copy this URL.

---

## Step 5 — Connect Frontend and Backend (CORS)

Now that you have the real Vercel URL, update the backend CORS config.

1. Open `Program.cs`
2. Replace the placeholder with your real Vercel URL:

   ```csharp
   builder.WithOrigins(
       "http://localhost:5173",
       "https://pirs-yourname.vercel.app"
   )
   ```

3. Commit and push:

   ```bash
   git add Backend/PIRS/PIRS/Program.cs
   git commit -m "update CORS for Vercel deployment"
   git push
   ```

4. Render will automatically redeploy when it detects the push.

---

## Step 6 — Verify Everything Works

Go through this checklist after both services are live:

- [ ] `https://pirs-backend.onrender.com/swagger` loads the Swagger UI
- [ ] `https://pirs-yourname.vercel.app` loads the React app
- [ ] You can register a new user account
- [ ] You can log in and get redirected to the dashboard
- [ ] You can create a report with a photo and location
- [ ] The report appears in the report list
- [ ] Upvoting works
- [ ] Company and contractor dashboards load without CORS errors (open browser DevTools → Console to check)

---

## Summary — Your Live URLs

| Service | URL |
|---|---|
| Frontend | `https://pirs-yourname.vercel.app` |
| Backend API | `https://pirs-backend.onrender.com` |
| Swagger UI | `https://pirs-backend.onrender.com/swagger` |
| Database | Supabase dashboard at `supabase.com` |

---

## Important Notes

### Render free tier sleeps after 15 minutes of inactivity

The first request after idle takes ~30 seconds to respond. To prevent this, use [UptimeRobot](https://uptimerobot.com) (free):

1. Go to [uptimerobot.com](https://uptimerobot.com) and create a free account
2. Click **Add New Monitor**
3. Type: **HTTP(s)**
4. URL: `https://pirs-backend.onrender.com/swagger`
5. Monitoring interval: **5 minutes**

This keeps your backend warm 24/7 for free.

---

### Images uploaded to Render will be lost on redeploy

Render's free tier has an ephemeral filesystem. Any photos uploaded to `wwwroot/Images/` disappear when the service redeploys.

For a free fix, use [Cloudinary](https://cloudinary.com) (25 GB free):

1. Create a free Cloudinary account
2. Install the SDK: `dotnet add package CloudinaryDotNet`
3. Add credentials to environment variables on Render:
   ```
   Cloudinary__CloudName   your-cloud-name
   Cloudinary__ApiKey      your-api-key
   Cloudinary__ApiSecret   your-api-secret
   ```
4. Replace local file save logic in `ImagesController.cs` and `ReportController.cs` with Cloudinary upload calls

---

### Keep your secrets secret

Never commit these to GitHub:
- `Jwt__Key`
- `ConnectionStrings__MyConnection`
- `Chapa__SecretKey`
- Cloudinary credentials

Always set them as environment variables in the Render dashboard, never in `appsettings.json`.
