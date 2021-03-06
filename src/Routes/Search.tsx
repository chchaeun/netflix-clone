import { AnimatePresence, useViewportScroll } from "framer-motion";
import { stringify } from "querystring";
import React from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getSearchMulti, ISearch } from "../api";
import MovieDetail from "../Components/MovieDetail";
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
export const Wrapper = styled.div`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(5, 1fr);
  position: absolute;
  width: 90%;
  left: 0;
  right: 0;
  top: 100px;
  margin: 10px auto;
`;
function Search() {
  const { scrollY } = useViewportScroll();
  const location = useLocation();
  const history = useHistory();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const detailMatch =
    useRouteMatch<{ type: string; id: string }>("/search/:type/:id");
  const { data } = useQuery<ISearch>(["search"], () =>
    getSearchMulti("" + keyword)
  );

  const contents =
    data?.results.filter((data) => data.media_type !== "person") || [];
  const boxClick = (type: string, movieId: number) => {
    if (type === "tv") {
      history.push(`/search/${type}/${movieId}`);
    } else {
      history.push(`/search/${type}/${movieId}`);
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
            onClick={() => boxClick(movie.media_type, movie.id)}
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
                      <MovieDetail
                        content={clickedContent.media_type}
                        id={clickedContent.id}
                      />
                      <ModalOverview>{clickedContent.overview}</ModalOverview>
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

export default Search;
