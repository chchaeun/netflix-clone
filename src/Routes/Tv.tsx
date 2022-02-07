import { AnimatePresence, useViewportScroll } from "framer-motion";
import React from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getTvs, IMoviesResult } from "../api";
import MovieDetail from "../Components/MovieDetail";
import MovieSlider from "../Components/MovieSlider";
import { makeImageUrl } from "../utils";
import {
  Banner,
  Modal,
  ModalBackground,
  ModalInfo,
  ModalOverview,
  ModalTitle,
  Overlay,
  Overview,
  Title,
  Wrapper,
} from "./Home";

function Tv() {
  const history = useHistory();
  const tvDetailMatch = useRouteMatch<{ category: string; tvId: string }>(
    "/tv/:category/:tvId"
  );
  const { data: onAirData } = useQuery<IMoviesResult>(["tv", "onAir"], () =>
    getTvs("on_the_air")
  );
  const { data: popularData, isLoading } = useQuery<IMoviesResult>(
    ["tv", "popular"],
    () => getTvs("popular")
  );
  const { data: topRatedData } = useQuery<IMoviesResult>(
    ["tv", "topRated"],
    () => getTvs("top_rated")
  );
  const tvData = onAirData?.results.concat(
    popularData?.results || [],
    topRatedData?.results || []
  );
  const clickedTv =
    tvDetailMatch && tvData?.find((tv) => tv.id === +tvDetailMatch.params.tvId);
  const tvSliders =
    onAirData && popularData && topRatedData
      ? [
          { title: "Popular", category: "popular", data: popularData },
          { title: "Top Rated", category: "top_rated", data: onAirData },
          { title: "On Air", category: "on_the_air", data: topRatedData },
        ]
      : [];
  const overlayClick = () => {
    history.push("/tv");
  };
  const { scrollY } = useViewportScroll();
  return (
    <Wrapper>
      {isLoading ? null : (
        <>
          <Banner
            bgphoto={makeImageUrl(popularData?.results[0].backdrop_path || "")}
          >
            <Title>{popularData?.results[0].name}</Title>
            <Overview>{popularData?.results[0].overview}</Overview>
          </Banner>
          {tvSliders.map((slider) => (
            <MovieSlider
              key={slider.category}
              title={slider.title}
              category={slider.category}
              data={slider.data}
            />
          ))}
          <AnimatePresence>
            {tvDetailMatch ? (
              <>
                <Overlay
                  onClick={overlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <Modal
                  style={{ top: scrollY.get() + 50 }}
                  layoutId={
                    tvDetailMatch.params.category + tvDetailMatch.params.tvId
                  }
                >
                  {clickedTv ? (
                    <>
                      <ModalBackground
                        bgphoto={makeImageUrl(
                          clickedTv?.backdrop_path + "",
                          "w500"
                        )}
                      />
                      <ModalInfo>
                        <ModalTitle>{clickedTv.name}</ModalTitle>
                        <MovieDetail content="tv" id={clickedTv.id} />
                        <ModalOverview>{clickedTv.overview}</ModalOverview>
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

export default Tv;
