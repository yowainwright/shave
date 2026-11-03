FROM node:26-slim@sha256:e4db4c914bf8ad241bd24804fc25d272d89bad97e68cdc8a1414862790a02c39

# Install pnpm
RUN npm install -g pnpm@12.16.1

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

# Install dependencies for Playwright
RUN pnpm exec playwright install-deps chromium firefox webkit \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

# Install Playwright browsers
RUN pnpm playwright install chromium firefox webkit

# Copy source files
COPY . .

# Build the project
RUN pnpm build

# Expose port for web server
EXPOSE 8080

# Run tests
CMD ["pnpm", "test"]
