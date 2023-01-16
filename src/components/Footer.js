import footerStyles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.footerContainer}>
        <small>
          <a href="https://gregskril.notion.site/ETH-Leaderboard-API-9cb07e49bfe04905bdc1608de48943dd">
            API Docs
          </a>
        </small>
        <small>
          Website by{' '}
          <a
            href="https://twitter.com/gregskril"
            target="_blank"
            rel="noreferrer"
          >
            @gregskril
          </a>{' '}
          and{' '}
          <a
            href="https://twitter.com/taytemss"
            target="_blank"
            rel="noreferrer"
          >
            @taytemss
          </a>
        </small>
        <small>
          Initial data from{' '}
          <a
            href="https://twitter.com/ultrasoundmoney"
            target="_blank"
            rel="noreferrer"
          >
            @ultrasoundmoney
          </a>
        </small>
      </div>
    </footer>
  );
}
