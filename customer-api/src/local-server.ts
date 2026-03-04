import express, { Request, Response } from 'express';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from './main';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Convert Express request to APIGatewayProxyEvent
const createAPIGatewayEvent = (req: Request): APIGatewayProxyEvent => {
  return {
    body: req.body ? JSON.stringify(req.body) : null,
    headers: req.headers as { [name: string]: string },
    multiValueHeaders: {},
    httpMethod: req.method,
    isBase64Encoded: false,
    path: req.path,
    pathParameters: req.params as { [name: string]: string } | null,
    queryStringParameters: req.query as { [name: string]: string },
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {
      accountId: 'local',
      apiId: 'local',
      protocol: 'HTTP/1.1',
      httpMethod: req.method,
      path: req.path,
      stage: 'local',
      requestId: `local-${Date.now()}`,
      requestTime: new Date().toISOString(),
      requestTimeEpoch: Date.now(),
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        clientCert: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: req.ip || '127.0.0.1',
        user: null,
        userAgent: req.get('user-agent') || null,
        userArn: null,
      },
      authorizer: null,
      domainName: 'localhost',
      domainPrefix: 'localhost',
      resourceId: 'local',
      resourcePath: req.path,
    },
    resource: req.path,
  };
};

// Create a mock Context
const createContext = (): Context => {
  return {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'customer-api-handler',
    functionVersion: '$LATEST',
    invokedFunctionArn: 'local',
    memoryLimitInMB: '512',
    awsRequestId: `local-${Date.now()}`,
    logGroupName: '/aws/lambda/customer-api-handler',
    logStreamName: 'local',
    getRemainingTimeInMillis: () => 300000,
    done: () => {},
    fail: () => {},
    succeed: () => {},
  };
};

// GET endpoint for customers
app.get('/customers', async (req: Request, res: Response) => {
  try {
    const event = createAPIGatewayEvent(req);
    const context = createContext();
    
    console.log(`Query parameters: ${JSON.stringify(req.query)}`);
    
    const result = await handler(event, context);
    
    if (result) {
      const body = JSON.parse(result.body);
      res.status(result.statusCode).json(body);
    } else {
      res.status(500).json({ error: 'No response from handler' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Local Lambda server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Customer API - Local Development Server',
    endpoints: {
      customers: 'GET /customers?start=0&max=10',
      health: 'GET /health'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Local Lambda Server Running');
  console.log('='.repeat(60));
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`📋 API Endpoint: http://localhost:${PORT}/customers?start=0&max=10`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('='.repeat(60) + '\n');
});
