import { ResponsiveLine } from '@nivo/line';
import Head from 'next/head';
import getDb from '../db';

type LineData = {
  id: string;
  color: string;
  data: {
    x: string;
    y: number;
  }[];
}[];

type EthCount = {
  date: Date;
  count: number;
};

export default function Stats({ data }: { data: LineData }) {
  return (
    <>
      <Head>
        <title>Stats | ETH Leaderboard</title>
      </Head>

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
          <MyResponsiveLine data={data} />
        </div>
      </div>

      <style jsx>{`
        .container {
          width: 100%;
          max-width: 55rem;
          margin: 0 auto;
          padding: 2rem 1rem;
          height: 200px;
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
          width: 100%;
          height: min(30rem, 100vh);
        }
      `}</style>
    </>
  );
}

const MyResponsiveLine = ({ data }: { data: LineData }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 5, right: 15, bottom: 50, left: 65 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false,
    }}
    yFormat=" >-.2f"
    axisBottom={{
      tickRotation: 0,
      legend: 'Date',
      legendOffset: 45,
      legendPosition: 'middle',
    }}
    axisLeft={{
      tickRotation: 0,
      legend: '.eth Profiles',
      legendOffset: -60,
      legendPosition: 'middle',
      format: (v) =>
        `${new Intl.NumberFormat('en-US', {
          notation: 'compact',
        }).format(v)}`,
    }}
    theme={{
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
    }}
    colors={{
      datum: 'color',
    }}
    pointColor={{ theme: 'background' }}
    pointLabelYOffset={-200}
    useMesh={true}
  />
);

export async function getStaticProps() {
  const db = await getDb();
  const entries: EthCount[] = await db['eth_count'].find();

  // only count every 14th entry
  const entriesSpaced = entries.filter((_, i) => i % 14 === 0);

  const data: LineData = [
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

  return {
    props: {
      data,
    },
  };
}
