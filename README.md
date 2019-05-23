# http-relay

HTTP/HTTPS relay, picks-up a request, makes it, and sends back the answer.  
Used in one of my projects as a proxy of sort, that handles HTTPS with no configuration.

## Usage

Setup users in the server.js file (password is in MD5).  
Run `yarn` or `node` to install dependencies.  
Server is now running on port `8888` !

## API

```js
method: 'POST',
url: '/',
payload: {
    method: String,
    url: String,
    payload: Object, // Optional
    headers: Object,
},
reponse: error || .data
```
