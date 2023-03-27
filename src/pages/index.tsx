import React, { useState, useLayoutEffect } from "react"
import type { PageProps } from "gatsby"
import { graphql } from "gatsby"
import styled from "styled-components"

import type Post from "Types/Post"
import useSiteMetadata from "Hooks/useSiteMetadata"
import Layout from "Layouts/layout"
import SEO from "Components/seo"
// import PostGrid from "Components/postGrid"
import CategoryFilter from "Components/catetgoryFilter"
import { useQuery, gql } from "@apollo/client"
import ProductGrid from "../components/productGrid/productGrid"

const Home = ({
  pageContext,
  data,
}: PageProps<Queries.Query, Queries.MarkdownRemarkFrontmatter>) => {
  const [lang] = useState({ k: 0, v: "en" })
  const [, setPosts] = useState<Post[]>([])
  const [products, setProducts] = useState<any[]>([])
  const currentCategory = pageContext.category
  const postData = data.allMarkdownRemark.edges

  const q = useQuery(queryx, {
    variables: {
      input: {
        auth: {
          apiKey: "API_63e668ea22e411bc88d1d93c",
          secretKey: "rKZPeKWw3IKI3P26T1f1Refz",
        },
        categoryName: null,
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      // console.log(data)
      // setWeather(data)
      // var s = new Date(
      //   data.getCityByName.weather.timestamp * 1000
      // ).toLocaleString("en-US")
      // setDate(s)
    },
  })
  // !q.loading && console.log("q: ", q.data)

  function truncateString(str: string, num: number) {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + "..."
  }

  // function createSlug(name: string) {
  //   // Convert the name to lowercase and remove leading/trailing whitespace
  //   let slug = name.trim().toLowerCase()

  //   // Replace all non-alphanumeric characters with a hyphen
  //   slug = slug.replace(/[^a-z0-9]+/g, "-")

  //   // Remove any consecutive hyphens
  //   slug = slug.replace(/--+/g, "-")

  //   // Remove any leading or trailing hyphens
  //   slug = slug.replace(/^-+|-+$/g, "")

  //   return slug
  // }

  useLayoutEffect(() => {
    if (q.loading) return
    const filteredProductData = currentCategory
      ? q?.data.ExternalUserProductGetAll.filter(
          (data: typeof q.data.ExternalUserProductGetAll) =>
            data?.category === currentCategory
        )
      : q?.data.ExternalUserProductGetAll

    filteredProductData.forEach(
      (data: typeof q.data.ExternalUserProductGetAll, index: number) => {
        const { price } = data!
        const category = data?.category?.name        
        const description = data?.description?.values?.[lang.k]?.text
        const name = data?.name?.values?.[lang.k]?.text
        const downloadUrl = data?.media?.image2dFiles?.[0]?.downloadUrl

        setProducts(prevPost => [
          ...prevPost,
          {
            id: index,
            name,
            // slug: createSlug(name),
            slug: "https://vrex-dev-vr.dev.motorenflug.at/project/f34d4b4419cac253b12f351ada1abd98",
            category,
            price,
            description: truncateString(description, 50),
            downloadUrl,
          },
        ])
      }
    )
  }, [currentCategory, lang, q])

  useLayoutEffect(() => {
    const filteredPostData = currentCategory
      ? postData.filter(
          ({ node }) => node?.frontmatter?.category === currentCategory
        )
      : postData

    filteredPostData.forEach(({ node }) => {
      const { id } = node
      const { slug } = node.fields!
      const { title, desc, date, category, thumbnail, alt } = node.frontmatter!
      const { childImageSharp } = thumbnail!

      setPosts(prevPost => [
        ...prevPost,
        {
          id,
          slug,
          title,
          desc,
          date,
          category,
          thumbnail: childImageSharp?.id,
          alt,
        },
      ])
    })
  }, [currentCategory, postData])

  const site = useSiteMetadata()
  const postTitle = currentCategory || site.postTitle

  return (
    <Layout>
      <SEO title="Home" />
      <Main>
        <Content>
          {/* <CategoryFilter categoryList={data.allMarkdownRemark.group} /> */}
          <CategoryFilter categoryList={[]} />
          <PostTitle>{postTitle}</PostTitle>
          <ProductGrid products={products} />
          {/* <PostGrid posts={posts} /> */}
        </Content>
      </Main>
    </Layout>
  )
}

const Main = styled.main`
  min-width: var(--min-width);
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
  background-color: var(--color-background);
`

const Content = styled.div`
  box-sizing: content-box;
  width: 87.5%;
  max-width: var(--width);
  padding-top: var(--sizing-lg);
  padding-bottom: var(--sizing-lg);
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    padding-top: var(--grid-gap-lg);
    width: 87.5%;
  }
`

const PostTitle = styled.h2`
  font-size: 2rem;
  font-weight: var(--font-weight-extra-bold);
  margin-bottom: var(--sizing-md);
  line-height: 1.21875;

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    font-size: 1.75rem;
  }
`

export const query = graphql`
  query Home {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/(posts/blog)/" } }
      limit: 2000
      sort: { frontmatter: { date: DESC } }
    ) {
      group(field: { frontmatter: { category: SELECT } }) {
        fieldValue
        totalCount
      }
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            category
            date(formatString: "YYYY-MM-DD")
            desc
            thumbnail {
              childImageSharp {
                id
              }
              base
            }
            alt
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

export const queryx = gql`
  query ExternalUserProductGetAll($input: ExternalUserProductGetAllInput!) {
    ExternalUserProductGetAll(input: $input) {
      name {
        text
        values {
          lang
          text
        }
      }
      description {
        text
        values {
          lang
          text
        }
      }
      price
      seo {
        title
        description
      }
      manufacturer
      options {
        colours
        materials
        sizes
      }
      tag
      media {
        image2dFiles {
          downloadUrl
        }

        name
      }
      shipping {
        weight
        originCountryOrRegion
        harmonisedSystemCode
      }
      category {
        name
      }
    }
  }
`

export default Home
