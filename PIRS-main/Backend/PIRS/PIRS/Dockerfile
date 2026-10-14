# ── Build stage ────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "PIRS.csproj"
RUN dotnet publish "PIRS.csproj" -c Release -o /app/publish

# ── Runtime stage ──────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Create folders for uploaded images (ephemeral - migrate to Cloudinary for production)
RUN mkdir -p wwwroot/Images/CompanyLogo wwwroot/Images/Report

EXPOSE 80
ENTRYPOINT ["dotnet", "PIRS.dll"]
