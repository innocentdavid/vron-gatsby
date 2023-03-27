const React = require("react")
const { ApolloClient, InMemoryCache } = require("@apollo/client");
const { ApolloProvider } = require("@apollo/client/react");
const fetch = require("cross-fetch");
// import { ApolloClient, InMemoryCache } from "@apollo/client"
// import { ApolloProvider } from "@apollo/client/react"
// import fetch from "cross-fetch"


exports.wrapRootElement = ({ element }) => {
  const client = new ApolloClient({
    uri: 'https://vrex-dev-api.dev.motorenflug.at/graphql/',
    cache: new InMemoryCache(),
    fetch,
  })

  return (
    <ApolloProvider client={client}>
      {element}
    </ApolloProvider>
  )
}
// export { wrapRootElement } from './src/apollo/provider';

exports.onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    React.createElement("script", {
      dangerouslySetInnerHTML: {
        __html: `
          (() => {    
            window.__onThemeChange = function() {};      

            function setTheme(newTheme) {                  
              window.__theme = newTheme;                  
              preferredTheme = newTheme;                  
              document.body.className = newTheme;
              document.body.dataset.theme = newTheme;                 
              window.__onThemeChange(newTheme);                
            }

            let preferredTheme

            try {
              preferredTheme = localStorage.getItem('theme')
            } catch (err) {}

            window.__setPreferredTheme = newTheme => {
              setTheme(newTheme)

              try {
                localStorage.setItem('theme', newTheme)
              } catch (err) {}
            }

            let darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

            darkQuery.addEventListener('change', e => {
              window.__setPreferredTheme(e.matches ? 'dark' : 'light')
            })

            setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'))
          })()
        `,
      },
    }),
  ])
}
