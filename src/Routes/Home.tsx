import {
  AnimatePresence,
  motion,
  MotionValue,
  useViewportScroll,
} from "framer-motion";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IMovieDetail, IMoviesResult } from "../api";
import MovieDetail from "../Components/MovieDetail";
import MovieSlider from "../Components/MovieSlider";
import { makeImageUrl } from "../utils";
export const Wrapper = styled.div`
  width: 100%;
  padding-bottom: 200px;
`;
export const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
export const Title = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 20px;
`;
export const Overview = styled.p`
  font-size: 1.2rem;
  width: 50%;
`;

export const Overlay = styled(motion.div)`
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 15;
`;
export const Modal = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: fit-content;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.darker};
  box-shadow: 1px 2px 20px 1px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  z-index: 20;
`;
export const ModalBackground = styled(motion.div)<{ bgphoto: string }>`
  background-image: linear-gradient(
      to top,
      ${(props) => props.theme.black.darker},
      transparent
    ),
    url(${(props) => props.bgphoto});
  width: 100%;
  height: 45vh;
  background-size: cover;
  background-position: center center;
`;
export const ModalInfo = styled.div`
  position: relative;
  top: -100px;
  margin: 20px;
`;
export const ModalTitle = styled.h2`
  font-size: 3em;
`;
export const ModalShorts = styled.div``;
export const ModalOverview = styled.p`
  padding: 10px 3px;
`;

function Home() {
  const history = useHistory();

  const { scrollY } = useViewportScroll();
  const movieMatch = useRouteMatch<{ category: string; movieId: string }>(
    "/movies/:category/:movieId"
  );

  const { data: nowPlayingData, isLoading } = useQuery<IMoviesResult>(
    ["movies", "nowPlaying"],
    () => getMovies("now_playing")
  );
  const { data: popularData } = useQuery<IMoviesResult>(
    ["movies", "popular"],
    () => getMovies("popular")
  );
  const { data: topRatedData } = useQuery<IMoviesResult>(
    ["movies", "topRated"],
    () => getMovies("top_rated")
  );
  const movieData = nowPlayingData?.results.concat(
    popularData?.results || [],
    topRatedData?.results || []
  );
  const clickedMovie =
    movieMatch &&
    movieData?.find((movie) => movie.id === +movieMatch.params.movieId);

  const movieSliders =
    nowPlayingData && popularData && topRatedData
      ? [
          {
            title: "Now Playing",
            category: "now_playing",
            data: nowPlayingData,
          },
          { title: "Popular", category: "popular", data: popularData },
          { title: "Top Rated", category: "top_rated", data: topRatedData },
        ]
      : [];

  const overlayClick = () => {
    history.push("/");
  };
  return (
    <Wrapper>
      {isLoading ? null : (
        <>
          <Banner
            bgphoto={makeImageUrl(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>
          {movieSliders.map((slider) => (
            <MovieSlider
              key={slider.category}
              title={slider.title}
              category={slider.category}
              data={slider.data}
            />
          ))}
          <AnimatePresence>
            {movieMatch ? (
              <>
                <Overlay
                  onClick={overlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <Modal
                  style={{ top: scrollY.get() + 50 }}
                  layoutId={
                    movieMatch.params.category + movieMatch.params.movieId
                  }
                >
                  {clickedMovie ? (
                    <>
                      <ModalBackground
                        bgphoto={makeImageUrl(
                          clickedMovie?.backdrop_path + "",
                          "w500"
                        )}
                      />
                      <ModalInfo>
                        <ModalTitle>{clickedMovie.title}</ModalTitle>
                        <MovieDetail content="movie" id={clickedMovie.id} />
                        <ModalOverview>{clickedMovie.overview}</ModalOverview>
                      </ModalInfo>
                    </>
                  ) : null}
                </Modal>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default React.memo(Home);
