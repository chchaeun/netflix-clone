import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

const Wrapper = styled(motion.div)`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e09, #d0e);
`;

const Box = styled(motion.div)`
  width: 400px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  top: 50px;
  font-size: 28px;
  justify-content: center;
  align-items: center;
  display: flex;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
  position: absolute;
`;
const boxVarients = {
  initial: (back: boolean) => ({
    opacity: 0,
    scale: 0,
    x: back ? -500 : 500,
  }),
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 1 },
  },
  leaving: (back: boolean) => ({
    opacity: 0,
    scale: 0,
    x: back ? 500 : -500,
    transition: { duration: 1 },
  }),
};
function App() {
  const [show, setShow] = useState(1);
  const [back, setBack] = useState(false);
  const prevClick = () => {
    setBack(() => true);
    setShow((prev) => (prev === 1 ? 1 : prev - 1));
  };
  const nextClick = () => {
    setBack(() => false);
    setShow((prev) => (prev === 10 ? 10 : prev + 1));
  };
  return (
    <Wrapper>
      <AnimatePresence>
        <Box
          key={show}
          variants={boxVarients}
          initial="initial"
          animate="visible"
          exit="leaving"
          custom={back}
        >
          {show}
        </Box>
      </AnimatePresence>
      <button onClick={prevClick}>prev</button>
      <button onClick={nextClick}>next</button>
    </Wrapper>
  );
}

export default App;
