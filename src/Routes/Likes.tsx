import React, { useEffect } from "react";
import { likesState } from "../atoms";
import { useRecoilValue } from "recoil";
import { Wrapper } from "./Search";
import { getMovieDetail, IMovieDetail } from "../api";
import { useQuery } from "react-query";
import { AnimatePresence, useViewportScroll } from "framer-motion";
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
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
function BoxFunc({ type, id }: { type: string; id: string }) {
  const history = useHistory();
  const { data } = useQuery<IMovieDetail>(["likes", id], () =>
    getMovieDetail(type, id)
  );
  const boxClick = (type: string, movieId: number) => {
    if (type === "tv") {
      history.push(`/likes/${type}/${movieId}`);
    } else {
      history.push(`/likes/${type}/${movieId}`);
    }
  };
  return (
    <>
      {data ? (
        <Box
          onClick={() => boxClick("movie", data.id)}
          layoutId={type + data.id}
          variants={boxVarients}
          initial="initial"
          whileHover="hover"
          transition={{ type: "tween" }}
          key={data.id}
          bgphoto={
            data.backdrop_path !== null
              ? makeImageUrl(data.backdrop_path, "w500")
              : ""
          }
        >
          <Info variants={infoVarients}>
            {data.title ? data.title : data.name ? data.name : null}
          </Info>
        </Box>
      ) : null}
    </>
  );
}
function ModalFunc({ type, id }: { type: string; id: string }) {
  const { data } = useQuery<IMovieDetail>(["likes", id], () =>
    getMovieDetail(type, id)
  );
  return (
    <>
      {data ? (
        <>
          <ModalBackground bgphoto={makeImageUrl(data?.backdrop_path + "")} />
          <ModalInfo>
            <ModalTitle>{data.title}</ModalTitle>
            <MovieDetail content={type} id={data.id} />
            <ModalOverview>{data.overview}</ModalOverview>
          </ModalInfo>
        </>
      ) : null}
    </>
  );
}
function Likes() {
  const likes = useRecoilValue(likesState);

  const { scrollY } = useViewportScroll();
  const history = useHistory();
  const detailMatch =
    useRouteMatch<{ type: string; id: string }>("/likes/:type/:id");

  const overlayClick = () => {
    history.goBack();
  };

  return (
    <Wrapper>
      <>
        {likes.map((like) => (
          <BoxFunc key={like.id} type={like.type} id={like.id} />
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
                style={{ top: scrollY.get() }}
                layoutId={detailMatch.params.type + detailMatch.params.id}
              >
                <ModalFunc
                  type={detailMatch.params.type}
                  id={detailMatch.params.id}
                />
              </Modal>
            </>
          ) : null}
        </AnimatePresence>
      </>
    </Wrapper>
  );
}

export default Likes;
