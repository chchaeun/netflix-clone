import {
  AnimatePresence,
  motion,
  MotionValue,
  useViewportScroll,
} from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getNowPlaying, INowPlaying } from "../api";
import { makeImageUrl } from "../utils";
const Wrapper = styled.div`
  width: 100%;
  padding-bottom: 200px;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
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

const Slider = styled.div`
  position: relative;
  top: -50px;
  width: 95vw;
  left: 0;
  right: 0;
  margin: 0 auto;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 140px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  position: absolute;
  width: 100%;
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter}
  font-size: 16px;
  padding: 8px;
  bottom:0;
  opacity:0;
  text-align: center;
`;

const Overlay = styled(motion.div)`
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const Modal = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: max-content;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.darker};
  box-shadow: 1px 2px 20px 1px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
`;
const ModalBackground = styled(motion.div)<{ bgphoto: string }>`
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
const ModalInfo = styled.div`
  position: relative;
  top: -100px;
  margin: 20px;
`;
const ModalTitle = styled.h2`
  font-size: 3em;
`;
const ModalOverview = styled.p`
  padding: 10px 3px;
`;
const rowVarients = {
  initial: {
    x: window.outerWidth + 5,
  },
  animate: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVarients = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -30,
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.5,
    },
  },
};

const infoVarients = {
  hover: {
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.5,
    },
  },
};
const offset = 6;

function Home() {
  const history = useHistory();
  const movieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<INowPlaying>(
    ["movies", "nowPlaying"],
    getNowPlaying
  );
  const clickedMovie =
    movieMatch &&
    data?.results.find((movie) => movie.id === +movieMatch.params.movieId);

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const maxIndex = Math.floor((data.results.length - 1) / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      console.log(maxIndex, index);
    }
  };
  const boxClick = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const overlayClick = () => {
    history.push("/");
  };
  return (
    <Wrapper>
      {isLoading ? null : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImageUrl(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVarients}
                initial="initial"
                animate="animate"
                exit="exit"
                key={index}
                transition={{ type: "tween", duration: 1 }}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * (index + 1))
                  .map((movie) => (
                    <Box
                      onClick={() => boxClick(movie.id)}
                      layoutId={movie.id + ""}
                      variants={boxVarients}
                      initial="initial"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      key={movie.id}
                      bgphoto={makeImageUrl(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVarients}>{movie.title}</Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
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
                  layoutId={movieMatch.params.movieId}
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

export default Home;
