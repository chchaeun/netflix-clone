import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IMoviesResult } from "../api";
import { makeImageUrl } from "../utils";

const Slider = styled.div`
  position: relative;
  bottom: 130px;
  width: 95vw;
  left: 0;
  right: 0;
  margin: 0 auto;
  margin-bottom: 200px;
`;
const SliderTitle = styled.h1`
  font-size: 2em;
  margin: 20px 5px;
  font-weight: 500;
`;
const ScrollButton = styled.button`
  border-radius: 4px;
  border: none;
  color: white;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  margin: 10px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
export const Box = styled(motion.div)<{ bgphoto: string }>`
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

export const Info = styled(motion.div)`
  position: absolute;
  width: 100%;
  background-color: ${(props) => props.theme.black.darker};
  color: ${(props) => props.theme.white.lighter}
  font-size: 16px;
  padding: 8px;
  bottom:0;
  opacity:0;
  text-align: center;
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

export const boxVarients = {
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

export const infoVarients = {
  hover: {
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.5,
    },
  },
};

interface IMovieSlider {
  title: string;
  category: string;
  data: IMoviesResult;
}
const offset = 6;
function MovieSlider({ title, category, data }: IMovieSlider) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const history = useHistory();
  const tvMatch = useRouteMatch("/tv");
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const maxIndex = Math.floor((data.results.length - 1) / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const boxClick = (movieId: number) => {
    if (tvMatch) {
      history.push(`/tv/${category}/${movieId}`);
    } else {
      history.push(`/movies/${category}/${movieId}`);
    }
  };

  return (
    <Slider>
      <SliderTitle>
        {title}
        <ScrollButton key={category} onClick={increaseIndex}>
          Next
        </ScrollButton>
      </SliderTitle>

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
            .slice(offset * index, offset * (index + 1))
            .map((movie) => (
              <Box
                onClick={() => boxClick(movie.id)}
                layoutId={category + movie.id}
                variants={boxVarients}
                initial="initial"
                whileHover="hover"
                transition={{ type: "tween" }}
                key={category + movie.id}
                bgphoto={makeImageUrl(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVarients}>
                  {movie.title ? movie.title : movie.name ? movie.name : null}
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </Slider>
  );
}

export default React.memo(MovieSlider);
