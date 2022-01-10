import Filters from "../components/Filters";
import FrensTable from "../components/FrensTable";
import Header from "../components/Header";
import Layout from "../components/layout";

export default function Home({ frensData }) {
  return (
    <Layout>
      <Header top10={"2.1"} top100={"3.4"} top500={"5.5"}>
        <Filters />
      </Header>
      <FrensTable />
    </Layout>
  );
}

export async function getStaticProps() {
  const frensData = "hello";
  return {
    props: {
      frensData,
    },
  };
}
