# PIRS — Public Infrastructure Reporting System

A full-stack web application that enables citizens to report public infrastructure problems, track resolution progress, and allows companies and contractors to coordinate repairs and process payments.

---

## What is PIRS?

PIRS (Public Infrastructure Reporting System) connects three groups of people:

- **Citizens (Users)** — submit geo-tagged reports about infrastructure issues like potholes, broken streetlights, or damaged roads, attach photos, and upvote issues to signal urgency
- **Companies** — government bodies or private organizations that manage infrastructure; they receive reports, assign contractors, and authorize payments
- **Contractors** — field workers who get assigned to reports, update their status, and receive payments upon resolution

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, MUI, React Leaflet, Axios, i18next |
| Backend | ASP.NET Core 6, EF Core 6, ASP.NET Identity |
| Database | SQL Server |
| Auth | JWT Bearer tokens |
| Payments | Chapa payment gateway |

---

## Quick Start

See [DOCUMENTATION.md](./DOCUMENTATION.md) for a full setup guide.

### Backend

```bash
cd Backend/PIRS/PIRS
# configure appsettings.json with your SQL Server connection string
dotnet ef database update
dotnet run
```

API runs at `https://localhost:7xxx` — Swagger UI at `/swagger`.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## Project Structure

```
PIRS-main/
├── Backend/PIRS/PIRS/          # ASP.NET Core 6 Web API
│   ├── Controllers/            # AccountController, ReportController, UserController,
│   │                           # ImagesController, TransactionController, RoleController
│   ├── Models/                 # EF Core models, DTOs, repositories
│   ├── Migrations/             # EF Core migration history
│   ├── wwwroot/Images/         # Uploaded report images and company logos
│   ├── appsettings.json        # App configuration
│   └── Program.cs              # Service registration and middleware pipeline
│
└── Frontend/                   # React + Vite SPA
    └── src/
        ├── App.jsx             # Root router
        ├── Routes/             # Page components by role (user, company, contractor)
        └── components/         # Shared UI components
```

---

## Key Features

- Submit and browse infrastructure reports with map-based location picking
- Photo attachments per report (multi-image gallery)
- Upvoting system to prioritize urgent issues
- Report status lifecycle: Pending → In Progress → Resolved
- Role-based dashboards for Users, Companies, and Contractors
- Contractor assignment and payment flow via Chapa
- Geo-proximity filtering and sorting of reports
- Rate limiting (10 req/s per IP)
- Multilingual UI via i18next

---

## Documentation

| Document | Description |
|---|---|
| [DOCUMENTATION.md](./DOCUMENTATION.md) | Full system documentation — architecture, API reference, data models, local setup |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Step-by-step deployment guides for Render, Vercel, Railway, and other free platforms |

---

## License

See [LICENSE](./LICENSE) for details.
