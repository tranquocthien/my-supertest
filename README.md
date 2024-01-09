
> A simple module for http server testing purpose
> Can use for both CommonJS and ES6 module

## 1. Install

- Install package by yarn

```sh
yarn add -D amaztest
```

## 2. Usage

### 2.1 Initialize Client

```typescript
import http from 'http';
import { Client } from 'amaztest';

const requestListener = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
};

// Test HTTP Server
const server = http.createServer(requestListener);
const client = new Client(server);

// OR Test HTTP Server Request Listener
const client = new Client(requestListener);

// Close server after all tests
afterAll(async () => {
  await client.close();
});
```

### 2.2 Client Usage

```typescript
const response1 = await client
  .get('/users?name=John&age=20')
  .query({ // <-- Set query string by object
    name: 'John',
    age: 20,
  });
  .set({ // <-- Set request header by object
    'authorization': 'Bearer ' + token,
    'accept': 'application/json'
  })

const response2 = await client
  .put('/users')
  .query('force', 'true') // <-- Set query string by key-value
  .set('authorization', 'Bearer ' + token) // <-- Set request header by key-value
  .send({ // <-- Set request body, auto set 'Content-Type' to 'application/json', auto stringify object and set 'Content-Length'
    name: 'John',
    age: 20,
  });

const response3 = await client
  .post('/users')
  .query(new URLSearchParams({ test: '123' })) // <-- Set query string by URLSearchParams
  .set('authorization', 'Bearer ' + token)
  .send('Hello World'); // <-- Set request body, auto set 'Content-Length'
  .send(
    Buffer.from('Hello World'), // <-- Set request body, auto set 'Content-Length'
  )
  .send(
    fs.createReadStream('file.txt'), // <-- Set request body by Stream.Readable instance, auto set 'Content-Length'
  );
```

### Upload file

```javascript
  import FormData from 'form-data'

    const filename= 'test'
    const fileExt = 'txt'
    const formData = new FormData()
    const file = fs.readFileSync(__dirname + '/' + filename + '.' + fileExt)
    formData.append('file', file, filename + '.' + fileExt)
    const requestBody = {
      id: faker.number.int({min: 1, max: 1000}),
    }
    formData.append('id', requestBody.id.toString())
    const { status, body } = await client
      .post('/document')
      .set(formData.getHeaders())
      .send(formData.getBuffer())
```


### 2.3 Response Interface

```typescript
interface Response {
  readonly statusCode: number
  readonly status: number // <-- Alias of statusCode
  readonly statusMessage: string
  readonly headers: http.OutgoingHttpHeaders
  readonly charset: BufferEncoding // <-- Auto parse from 'Content-Type' header
  readonly contentType: string // <-- Auto parse from 'Content-Type' header to MIME type
  readonly body: string | object | Buffer // <-- Auto parse to object if 'Content-Type' is 'application/json'
}
```

## 3. Advanced Usage

### 3.1 Extends the `Request` class

```typescript
import { Client, Request, CreateRequestOptions } from '@amaztest';

class MyRequest extends Request {
  constructor(options: CreateRequestOptions) {
    super(options);
    // ...
  }

  setCredentials(username: string, password: string) {
    this.set('authorization', 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'));
  }
}
class MyClient extends Client {
  getRequestClass() {
    return MyRequest;
  }
}

const client = new MyClient(server);
```

### 3.2 Register hooks before request is sent
  
```typescript
client.onBeforeSend(async (request) => {
  // ...
});
```
