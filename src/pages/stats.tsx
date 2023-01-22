import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { useWindowSize } from 'usehooks-ts';
import Head from 'next/head';

import { fetchInitialMetadata } from '../staticapi';
import { IntlNumberFormat } from '../utils/format';
import { Metadata } from '../types';
import { nivoTheme, nivoTooltipStyles } from '../utils/nivo';
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

type FollowerDistributionBar = {
  color: string;
  count: number;
  group: string;
}[];

type EthCount = {
  date: Date;
  count: number;
};

type StatsProps = {
  barData: BarData;
  followerDistribution: FollowerDistributionBar;
  frensMeta: Metadata;
  lineData: LineData;
};

export default function Stats({
  barData,
  followerDistribution,
  frensMeta,
  lineData,
}: StatsProps) {
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
          <RegionBarGraph data={barData} />
        </div>

        <div className="container--small">
          <p>
            This bar graph represents the breakdown of .eth Twitter profiles
            based on their follower count.
          </p>
        </div>

        <div className="line">
          <FollowerBarGraph data={followerDistribution} />
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
      tooltip={function (e) {
        return (
          <div style={nivoTooltipStyles}>
            {IntlNumberFormat(e.point.data.yFormatted)} profiles on{' '}
            {e.point.data.xFormatted}
          </div>
        );
      }}
    />
  );
};

const RegionBarGraph = ({ data }: { data: BarData }) => (
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
    tooltip={({ value, indexValue }) => (
      <div style={nivoTooltipStyles}>
        {IntlNumberFormat(value)} profiles in {indexValue}
      </div>
    )}
    valueFormat={function (e) {
      return IntlNumberFormat(e);
    }}
  />
);

const FollowerBarGraph = ({ data }: { data: FollowerDistributionBar }) => (
  <ResponsiveBar
    data={data}
    keys={['count']}
    layout="vertical"
    indexBy="group"
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
      format: (v) => `${v} followers`,
    }}
    theme={nivoTheme}
    role="application"
    ariaLabel=".eth Twitter profiles broken down by number of followers"
    barAriaLabel={function (e) {
      return (
        e.id + ': ' + e.formattedValue + ' with ' + e.indexValue + ' followers'
      );
    }}
    tooltip={({ value, indexValue }) => (
      <div style={nivoTooltipStyles}>
        {IntlNumberFormat(value)} profiles with {indexValue} followers
      </div>
    )}
    valueFormat={function (e) {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(Number(e));
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

  const followerDistributionRaw = await db.query(`
    SELECT 
      CASE
        WHEN followers BETWEEN 0 AND 9 THEN '0-9'
        WHEN followers BETWEEN 10 AND 99 THEN '10-99'
        WHEN followers BETWEEN 100 AND 999 THEN '100-999'
        ELSE '1000+'
      END as "Followers",
      COUNT(*) as "count"
    FROM "eth"
    GROUP BY "Followers"
  `);

  // followerDistribution is formatted as [{ Followers: '0-9', count: '123' }, ...]
  // we want to convert it to [{ group: '0-9', count: 123 }, ...]
  const followerDistribution = followerDistributionRaw.map((entry: any) => ({
    color: 'var(--text-color-accent)',
    count: parseInt(entry.count),
    group: entry.Followers,
  }));

  const frensMeta = await fetchInitialMetadata();

  return {
    props: {
      barData,
      followerDistribution,
      frensMeta,
      lineData,
    },
    revalidate: 60 * 60, // 1 hour
  };
}
