import React from "react";
import { likesState } from "../atoms";
import { useRecoilValue } from "recoil";
import { Wrapper } from "./Search";
import { getMovieDetail, IMovieDetail } from "../api";
import { useQuery } from "react-query";
import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import {
  Box,
  boxVarients,
  Info,
  infoVarients,
} from "../Components/MovieSlider";
import { makeImageUrl } from "../utils";
import {
  Modal,
  ModalBackground,
  ModalInfo,
  ModalOverview,
  ModalTitle,
  Overlay,
} from "./Home";
import MovieDetail from "../Components/MovieDetail";

function Likes() {
  const likes = useRecoilValue(likesState);
  const { data } = useQuery<IMovieDetail>(["likes"], () =>
    getMovieDetail(likes[0].type, likes[0].id)
  );
  const contents = data ? [data] : [];
  const { scrollY } = useViewportScroll();
  const location = useLocation();
  const history = useHistory();
  const detailMatch =
    useRouteMatch<{ type: string; id: string }>("/likes/:type/:id");
  const boxClick = (type: string, movieId: number) => {
    if (type === "tv") {
      history.push(`/likes/${type}/${movieId}`);
    } else {
      history.push(`/likes/${type}/${movieId}`);
    }
  };
  const overlayClick = () => {
    history.goBack();
  };
  const clickedContent =
    detailMatch &&
    contents.find((content) => content.id === +detailMatch.params.id);

  return (
    <Wrapper>
      <>
        {contents.map((movie) => (
          <Box
            onClick={() => boxClick("movie", movie.id)}
            layoutId={"" + movie.id}
            variants={boxVarients}
            initial="initial"
            whileHover="hover"
            transition={{ type: "tween" }}
            key={movie.id}
            bgphoto={
              movie.backdrop_path !== null
                ? makeImageUrl(movie.backdrop_path, "w500")
                : ""
            }
          >
            <Info variants={infoVarients}>
              {movie.title ? movie.title : movie.name ? movie.name : null}
            </Info>
          </Box>
        ))}
        <AnimatePresence>
          {detailMatch ? (
            <>
              <Overlay
                onClick={overlayClick}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <Modal
                style={{ top: scrollY.get() + 50 }}
                layoutId={detailMatch.params.type + detailMatch.params.id}
              >
                {clickedContent ? (
                  <>
                    <ModalBackground
                      bgphoto={makeImageUrl(clickedContent?.backdrop_path + "")}
                    />
                    <ModalInfo>
                      <ModalTitle>{clickedContent.title}</ModalTitle>
                      <MovieDetail content={"movie"} id={clickedContent.id} />
                      <ModalOverview>{"ddd"}</ModalOverview>
                    </ModalInfo>
                  </>
                ) : null}
              </Modal>
            </>
          ) : null}
        </AnimatePresence>
      </>
    </Wrapper>
  );
}

export default Likes;
