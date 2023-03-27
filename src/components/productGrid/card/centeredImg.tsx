import React from "react"
import styled from "styled-components"
// import { graphql, useStaticQuery } from "gatsby"
// import { GatsbyImage } from "gatsby-plugin-image"
// import type { IGatsbyImageData } from "gatsby-plugin-image"

// const DEFAULT_ALT = "Thumbnail Image"

const CenteredImg = ({ src, alt }) => {
  
  // const image = useMemo(() => {
  //   return src as IGatsbyImageData
  // }, [src])  

  return (
    <ThumbnailWrapper>
      <InnerWrapper>
        {/* <GatsbyImage image={{src}} loading="eager" alt={alt ?? DEFAULT_ALT} /> */}
        <img src={src} alt={alt} />
      </InnerWrapper>
    </ThumbnailWrapper>
  )
}

export const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    background-color: var(--color-dimmed);
    transition: 0.3s ease;
  }
`

const InnerWrapper = styled.div`
  overflow: hidden;
`

export default React.memo(CenteredImg)
