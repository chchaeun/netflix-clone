import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(135deg, #e09, #d0e);
`;

const Box = styled(motion.div)`
  width: 300px;
  height: 300px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  font-size: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;
const Circle = styled(motion.div)`
  width: 100px;
  height: 100px;
  border-radius: 100px;
  background-color: #9494e6;
`;
function App() {
  const [clicked, setClicked] = useState(false);
  const onClick = () => {
    setClicked((prev) => !prev);
  };
  return (
    <Wrapper onClick={onClick}>
      <Box>{clicked ? <Circle layoutId="circle" /> : null}</Box>
      <Box>
        {!clicked ? <Circle style={{ scale: "2" }} layoutId="circle" /> : null}
      </Box>
    </Wrapper>
  );
}

export default App;
