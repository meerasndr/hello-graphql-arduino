const { Board, Led } = require("johnny-five");
const board = new Board();
const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const fetch = require('cross-fetch/polyfill').fetch;
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;

const client = new ApolloClient({
    link: createHttpLink({
        uri: {GRAPHQL_ENDPOINT},
        fetch: fetch
    }),
    cache: new InMemoryCache()
});

board.on("ready", () => {
  const led = new Led(13);
  console.log('Board ready')
  board.repl.inject({
    led
  })
  client.query({
    query: gql`
    query someQuery{
    author(where: {name: {_eq: "Rowling"}}){
      name
          }
  }`,
}).then(res => {
  console.log(res)
  if(res.data.author.length > 0){
    led.blink(1000);
  }
  else{
    led.blink(3000);
  }
})

board.on("exit", () => {
  console.log("Exiting")
  led.off()
})
})
