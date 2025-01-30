# Terraform Module Provider

A flexible Terraform module provider written in TypeScript that supports multiple storage backends for module distribution.

## Features

- Multiple storage backend support (Azure Blob Storage, Cloudflare R2, Local filesystem)
- Module versioning
- Namespace organization
- RESTful API for module management

## Getting Started

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
pnpm install
```

2. Configure your environment variables:

```bash
cp .env.example .env
# Edit .env with your storage backend credentials
```

3. Start the development server:

```bash
pnpm dev
```

## API Endpoints

- `GET /api/:namespace/:name/:version` - Retrieve a specific module version
- `GET /api/:namespace/:name` - List all versions of a module
- `POST /api/:namespace/:name` - Upload a new module version

## Storage Backends

Currently supported storage backends:

- Cloudflare R2
- Amazon S3
- Local filesystem

## Development

```bash
# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start
```

## License

MIT
