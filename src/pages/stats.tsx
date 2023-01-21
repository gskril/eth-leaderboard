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
        <title>Stats</title>
      </Head>

      <div
        style={{
          // width: '400px',
          height: '400px',
        }}
      >
        <MyResponsiveLine data={data} />
      </div>
    </>
  );
}

const MyResponsiveLine = ({ data }: { data: LineData }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 5, right: 15, bottom: 50, left: 70 }}
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
      legend: 'Week',
      legendOffset: 45,
      legendPosition: 'middle',
    }}
    axisLeft={{
      tickRotation: 0,
      legend: '.eth Profiles',
      legendOffset: -65,
      legendPosition: 'middle',
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
