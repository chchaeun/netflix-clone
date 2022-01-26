import React, { useRef } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;
const BiggerBox = styled(motion.div)`
  width: 300px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 40px;
  /* overflow: hidden; */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;
const Box = styled(motion.div)`
  width: 150px;
  height: 150px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

const boxVarient = {
  hover: { scale: 1, rotateZ: 90 },
  tap: { scale: 1, borderRadius: "150px" },
};
function App() {
  const biggerBoxRef = useRef<HTMLDivElement>(null);
  return (
    <Wrapper>
      <BiggerBox ref={biggerBoxRef}>
        <Box
          drag
          dragConstraints={biggerBoxRef}
          dragSnapToOrigin
          dragElastic={1}
          variants={boxVarient}
          whileTap="tap"
          whileHover="hover"
        />
      </BiggerBox>
    </Wrapper>
  );
}

export default App;
