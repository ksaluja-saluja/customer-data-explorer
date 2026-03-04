# Customer API - Local Development

## Quick Start

The Lambda function can run locally using an Express-based development server (no Docker required).

### Start the Server

```bash
npm run dev
# or
npm start
```

The server will start on http://localhost:3000

### Available Endpoints

- **GET /customers** - Get paginated customer list
  ```bash
  curl "http://localhost:3000/customers?start=0&max=10"
  ```

- **GET /health** - Health check endpoint
  ```bash
  curl http://localhost:3000/health
  ```

- **GET /** - API information
  ```bash
  curl http://localhost:3000/
  ```

### Development Scripts

- `npm run dev` - Start the development server
- `npm run dev:watch` - Start with auto-reload on file changes
- `npm start` - Alias for `npm run dev`
- `npm run local:start` - Alias for `npm run dev`

### Environment Configuration

The Lambda handler uses AWS RDS Data API. To connect to a real database, set these environment variables:

```bash
export AWS_REGION=us-east-1
export AWS_PROFILE=your-profile  # or configure AWS credentials
```

If you haven't configured AWS credentials, the server will still run but database queries will fail with "Region is missing" error.

### Testing Without Database

The server infrastructure is working if you see:
- ✅ Server starts without errors
- ✅ `/health` endpoint returns `{"status":"ok"}`
- ✅ `/customers` endpoint receives and processes requests

Database connection errors are expected until AWS credentials are configured.

## CDK Deployment

For deploying to AWS or running with SAM CLI (requires Docker):

- `npm run cdk:synth` - Generate CloudFormation template
- `npm run cdk:deploy` - Deploy to AWS
- `npm run local:sam` - Run with SAM CLI (requires Docker)

See [README_CDK.md](README_CDK.md) for detailed CDK documentation.

## Architecture

The local server wraps your Lambda handler in an Express application:

```
HTTP Request → Express Server → Lambda Handler → Response
```

The Express server:
- Converts HTTP requests to API Gateway events
- Invokes your Lambda handler
- Returns the response to the client

This gives you a fast local development experience identical to how the Lambda runs in AWS.
