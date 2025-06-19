# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/ClientApp

# Copy only package.json and package-lock.json first for caching npm install step
COPY ClientApp/package.json ClientApp/package-lock.json ./

RUN npm install
COPY ClientApp/ ./
RUN npm run build

# Stage 2: Build the .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ARMS-web-utm.sln ./
COPY ARMS-web-utm.csproj ./
RUN dotnet restore ARMS-web-utm.csproj
COPY . ./
RUN dotnet publish ARMS-web-utm.csproj -c Release -o /app/publish

# Stage 3: Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy backend publish output
COPY --from=build /app/publish ./

# Copy frontend build output to wwwroot
COPY --from=frontend-build /app/ClientApp/build ./wwwroot

# Expose port 80 (default for ASP.NET Core)
EXPOSE 80

ENTRYPOINT ["dotnet", "ARMS-web-utm.dll"]
