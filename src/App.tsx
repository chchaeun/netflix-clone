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
const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 50vw;
  gap: 10px;
`;

const Box = styled(motion.div)`
  height: 150px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

const Circle = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 100px;
  background-color: white;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.1);
`;
const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: center;
  align-items: center;
  display: flex;
`;
const OverlayBox = styled(Box)`
  width: 400px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
`;
const overlay = {
  visible: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
  invisible: { backgroundColor: "rgba(0, 0, 0, 0)" },
};
const Button = styled.button`
  position: absolute;
  width: 50px;
  height: 25px;
  bottom: 5%;
  border: none;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
`;
function App() {
  const [id, setId] = useState<null | number>(null);
  const [click, setClick] = useState<boolean>(false);
  return (
    <Wrapper>
      <Grid>
        {[
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ].map((v, n) => (
          <Box
            whileHover={{ scale: 1.2, x: `${v[0] * 10}%`, y: `${v[1] * 10}%` }}
            onClick={() => setId(n + 1)}
            key={n + 1}
            layoutId={n + 1 + ""}
          >
            <AnimatePresence>
              {(n === 1 && click) || (n === 2 && !click) ? (
                <Circle layoutId="circle" />
              ) : null}
            </AnimatePresence>
          </Box>
        ))}
      </Grid>
      <Button onClick={() => setClick((prev) => !prev)}>Switch</Button>
      <AnimatePresence>
        {id ? (
          <Overlay
            onClick={() => setId(null)}
            variants={overlay}
            initial="invisible"
            animate="visible"
            exit="invisible"
          >
            <OverlayBox layoutId={id + ""} />
          </Overlay>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default App;
