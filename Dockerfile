# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1: build the Angular frontend
# ---------------------------------------------------------------------------
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2: install backend dependencies and assemble the runtime image
# ---------------------------------------------------------------------------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./

# Copy the Angular production build into the path server.js already expects
# (../frontend/dist/budget-utilization-monitoring relative to backend/),
# so the same server.js that works locally serves it here with no changes.
COPY --from=frontend-build /app/frontend/dist/budget-utilization-monitoring /app/frontend/dist/budget-utilization-monitoring

# Render (and most PaaS Docker runners) inject PORT at runtime; 5000 is the
# local-run default and matches backend/.env.example.
ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
