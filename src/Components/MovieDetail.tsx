import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { ILikes, likesState } from "../atoms";
import {
  getMovieCast,
  getMovieDetail,
  getMovies,
  IMovieCast,
  IMovieDetail,
} from "../api";
import { motion } from "framer-motion";

const Detail = styled.div`
  margin: 10px 5px;
`;
const Keyword = styled(motion.span)`
  font-weight: 500;
  font-size: 0.8em;
  position: relative;
  margin-right: 5px;
  padding: 0px 4px 3px 4px;
`;
const Title = styled.span`
  color: gray;
  position: relative;
  top: 10px;
`;
const Content = styled.span`
  color: ${(props) => props.theme.white.darker};
  position: relative;
  top: 10px;
  font-size: 0.8em;
`;

interface IDetail {
  content: string;
  id: number;
}

function MovieDetail({ content, id }: IDetail) {
  const setLikes = useSetRecoilState(likesState);

  const { data: movieDetail } = useQuery<IMovieDetail>(
    ["movieDetail", id],
    () => getMovieDetail(content, "" + id)
  );
  const { data: movieCast } = useQuery<IMovieCast>(["movieCast", id], () =>
    getMovieCast(content, "" + id)
  );
  const getYear = (year: string) => new Date(year).getFullYear() + "";
  const date =
    content === "movie"
      ? getYear(movieDetail?.release_date + "")
      : getYear(movieDetail?.first_air_date + "") ===
        getYear(movieDetail?.last_air_date + "")
      ? getYear(movieDetail?.last_air_date + "")
      : getYear(movieDetail?.first_air_date + "") +
        "-" +
        getYear(movieDetail?.last_air_date + "");
  const runtime =
    content === "movie"
      ? movieDetail?.runtime
      : "About " + movieDetail?.episode_run_time;
  const likeClick = (content: string, id: string) => {
    setLikes((prev) => {
      return [...prev, { type: content, id: id }];
    });
  };
  return (
    <>
      {movieDetail ? (
        <Detail>
          <Keyword
            whileHover={{ opacity: 0.6 }}
            style={{
              backgroundColor: "#474747",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => likeClick(content, "" + id)}
          >
            Like
          </Keyword>
          <Keyword style={{ backgroundColor: "#d32222", borderRadius: "5px" }}>
            {date}
          </Keyword>
          {runtime !== undefined && (
            <Keyword
              style={{
                backgroundColor: "#ebe182",
                borderRadius: "5px",
                color: "black",
              }}
            >
              {runtime} minutes
            </Keyword>
          )}
          <div>
            <Title>Genre: </Title>
            <Content>
              {movieDetail?.genres.map((genre, idx) =>
                idx !== movieDetail.genres.length - 1
                  ? genre.name + ", "
                  : genre.name
              )}
            </Content>
          </div>
          <div>
            <Title>Cast: </Title>
            <Content>
              {movieCast?.cast
                .slice(0, 5)
                .map((cast, idx) => (idx !== 4 ? cast.name + ", " : cast.name))}
            </Content>
          </div>
        </Detail>
      ) : null}
    </>
  );
}

export default MovieDetail;
