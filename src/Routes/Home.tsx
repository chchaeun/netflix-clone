import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getNowPlaying, INowPlaying } from "../api";
import { makeImageUrl } from "../utils";
const Wrapper = styled.div`
  width: 100%;
`;
const Banner = styled.div<{ bgImage: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgImage});
  background-size: cover;
`;
const Title = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 1.2rem;
  width: 50%;
`;
function Home() {
  const { data, isLoading } = useQuery<INowPlaying>(
    ["movies", "nowPlaying"],
    getNowPlaying
  );
  return (
    <Wrapper>
      {isLoading ? null : (
        <>
          <Banner bgImage={makeImageUrl(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
