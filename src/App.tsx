import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;
const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;
const Circle = styled(motion.div)`
  background-color: white;
  height: 70px;
  width: 70px;
  place-self: center;
  border-radius: 35px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;
const boxVarient = {
  start: {
    opacity: 0,
    scale: 0,
  },
  end: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      delay: 0.5,
      duration: 0.5,
      bounce: 0.5,
      delayChildren: 0.5,
      staggerChildren: 0.1,
    },
  },
};
const circleVarient = {
  start: { opacity: 0, y: 10 },
  end: { opacity: 1, y: 0 },
};
function App() {
  return (
    <Wrapper>
      <Box variants={boxVarient} initial="start" animate="end">
        <Circle variants={circleVarient} />
        <Circle variants={circleVarient} />
        <Circle variants={circleVarient} />
        <Circle variants={circleVarient} />
      </Box>
    </Wrapper>
  );
}

export default App;
