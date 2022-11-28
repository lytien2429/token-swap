import type { NextPage } from "next";
import Head from "next/head";
import Home from "../views/Home";

const Index: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Swap</title>
        <meta
          name="description"
          content="Solana Swap"
        />
      </Head>
      <Home />
    </div>
  );
};

export default Index;
