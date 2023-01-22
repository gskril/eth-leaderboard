import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { useWindowSize } from 'usehooks-ts';
import Head from 'next/head';

import { fetchInitialMetadata } from '../staticapi';
import { Metadata } from '../types';
import getDb from '../db';
import Header from '../components/Header';
import Layout from '../components/Layout';

type LineData = {
  id: string;
  color: string;
  data: {
    x: string;
    y: number;
  }[];
}[];

type BarData = {
  region: string;
  count: number;
  color: string;
}[];

type EthCount = {
  date: Date;
  count: number;
};

type StatsProps = {
  barData: BarData;
  lineData: LineData;
  frensMeta: Metadata;
};

const nivoTheme = {
  background: 'transparent',
  textColor: 'var(--text-color)',
  axis: {
    ticks: {
      line: {
        stroke: 'var(--text-color-lightest)',
      },
      text: {
        fontSize: 11,
        fill: 'var(--text-color-light)',
      },
    },
  },
  grid: {
    line: {
      stroke: 'var(--text-color-lightest)',
    },
  },
  tooltip: {
    container: {
      background: 'var(--background-accent-light)',
      border: '1px solid var(--text-color-lighter)',
    },
  },
};

export default function Stats({ barData, lineData, frensMeta }: StatsProps) {
  return (
    <Layout>
      <Head>
        <title>.eth Leaderboard Stats</title>
        <meta
          name="description"
          content="Insights on the .eth Twitter community"
        />
        <meta property="og:title" content=".eth Leaderboard Stats" />
        <meta
          property="og:description"
          content="Insights on the .eth Twitter community"
        />
        <meta
          property="og:image"
          content="https://ethleaderboard.xyz/sharing.jpg"
        />
      </Head>

      <Header {...frensMeta} />

      <div className="container">
        <div className="container--small">
          <p>
            This line chart represents the number of .eth profiles in our
            database on a given day.
          </p>
          <p>
            Note that we can never have 100% coverage due to Twitter API
            limitations, but our indexer captures as many profiles as it can.
            Sudden changes may be caused by improvements made to the indexer.
          </p>
        </div>

        <div className="line">
          <MyResponsiveLine data={lineData} />
        </div>

        <div className="container--small">
          <p>
            This bar graph represents the number of .eth profiles in popular
            regions based on their Twitter location.
          </p>
        </div>

        <div className="line">
          <MyResponsiveBar data={barData} />
        </div>
      </div>

      <style jsx>{`
        .container {
          width: 100%;
          max-width: 55rem;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .container--small {
          max-width: 37rem;
          margin: 0 auto;
        }

        p {
          text-align: center;
          font-weight: 300;
          margin-bottom: 2rem;
          color: var(--text-color-light);
        }

        .line {
          margin-bottom: 4rem;
          width: 100%;
          height: min(30rem, 100vh);
        }
      `}</style>
    </Layout>
  );
}

const MyResponsiveLine = ({ data }: { data: LineData }) => {
  const { width } = useWindowSize();
  const isMobile = width && width < 768;

  return (
    <ResponsiveLine
      data={data}
      margin={{
        top: 5,
        right: 12,
        bottom: isMobile ? 65 : 50,
        left: isMobile ? 35 : 65,
      }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 85_000,
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisBottom={{
        tickRotation: isMobile ? -90 : 0,
        legend: 'Date',
        legendOffset: isMobile ? 60 : 45,
        tickSize: 10,
        legendPosition: 'middle',
      }}
      axisLeft={{
        tickRotation: 0,
        legend: isMobile ? null : '.eth Profiles',
        legendOffset: -60,
        legendPosition: 'middle',
        format: (v) =>
          `${new Intl.NumberFormat('en-US', {
            notation: 'compact',
          }).format(v)}`,
      }}
      theme={nivoTheme}
      colors={{ datum: 'color' }}
      pointColor={{ theme: 'background' }}
      pointLabelYOffset={-200}
      useMesh={true}
    />
  );
};

const MyResponsiveBar = ({ data }: { data: BarData }) => (
  <ResponsiveBar
    data={data}
    keys={['count']}
    layout="vertical"
    indexBy="region"
    margin={{ top: 0, right: 0, bottom: 20, left: 0 }}
    padding={0.3}
    colors={{ datum: 'data.color' }}
    labelTextColor={{
      from: 'color',
      modifiers: [['darker', 1.6]],
    }}
    axisLeft={null}
    axisBottom={{
      tickSize: 0,
      tickPadding: 10,
      tickValues: 5,
      tickRotation: 0,
    }}
    theme={nivoTheme}
    role="application"
    ariaLabel=".eth Twitter profiles per region"
    barAriaLabel={function (e) {
      return e.id + ': ' + e.formattedValue + ' in region: ' + e.indexValue;
    }}
  />
);

export async function getStaticProps() {
  const db = await getDb();
  const entries: EthCount[] = await db['eth_count'].find();

  // only count every 14th entry
  const entriesSpaced = entries.filter((_, i) => i % 14 === 0);

  const lineData: LineData = [
    {
      id: '.eth Profiles',
      color: 'var(--text-color-accent)',
      data: entriesSpaced.map((entry) => ({
        x: new Intl.DateTimeFormat('en-US', {
          month: 'numeric',
          day: 'numeric',
        }).format(entry.date),
        y: entry.count,
      })),
    },
  ];

  const newYork = await db['eth'].count({
    or: [
      { 'location ilike': 'ny' },
      { 'location ilike': '%nyc%' },
      { 'location ilike': '%, ny%' },
      { 'location ilike': '%new york%' },
      { 'location ilike': '%brooklyn%' },
    ],
  });

  const california = await db['eth'].count({
    or: [
      { 'location ilike': 'ca' },
      { 'location ilike': '%, ca%' },
      { 'location ilike': '%california%' },
      { 'location ilike': '%los angeles%' },
      { 'location ilike': '%san francisco%' },
      { 'location ilike': '%bay area%' },
      { 'location ilike': '%san diego%' },
    ],
  });

  const texas = await db['eth'].count({
    or: [
      { 'location ilike': 'tx' },
      { 'location ilike': '%, tx%' },
      { 'location ilike': '%texas%' },
      { 'location ilike': '%austin%' },
      { 'location ilike': '%dallas%' },
    ],
  });

  const barData: BarData = [
    {
      region: 'New York',
      count: newYork,
      color: 'var(--text-color-accent)',
    },
    {
      region: 'California',
      count: california,
      color: 'var(--text-color-accent)',
    },
    {
      region: 'Texas',
      count: texas,
      color: 'var(--text-color-accent)',
    },
  ];

  const frensMeta = await fetchInitialMetadata();

  return {
    props: {
      lineData,
      barData,
      frensMeta,
    },
    revalidate: 60 * 60, // 1 hour
  };
}
