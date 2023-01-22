import { IntlNumberFormat } from './format';

export const nivoTheme = {
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

export const nivoTooltipStyles = {
  padding: '9px 12px',
  background: 'var(--background-accent-light)',
  border: '1px solid var(--text-color-lighter)',
};
