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
  position: absolute;
  top: 50px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;
const boxVarients = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateZ: 360,
  },
  leaving: {
    opacity: 0,
    y: 50,
  },
};
function App() {
  const [show, setShow] = useState(false);
  return (
    <Wrapper>
      <AnimatePresence>
        {show ? (
          <Box
            variants={boxVarients}
            initial="initial"
            animate="visible"
            exit="leaving"
          />
        ) : null}
      </AnimatePresence>
      <button onClick={() => setShow((prev) => !prev)}>toggle</button>
    </Wrapper>
  );
}

export default App;
