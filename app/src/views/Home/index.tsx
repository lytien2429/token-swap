import { FC } from "react";

import Header from "./Header";
import Description from "./Description";
import SwapForm from "./SwapForm";

import styles from "./index.module.css";
import { SwapContextProvider } from "../../contexts/SwapProvider";

const Home: FC = ({}) => {
  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <Header />
        <Description />
        <SwapContextProvider>
          <SwapForm />
        </SwapContextProvider>
      </div>
    </div>
  );
};

export default Home;
