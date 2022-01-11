import footerStyles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.footerContainer}>
        <small>
          Website by{" "}
          <a href="https://twitter.com/gregskril" target="_blank">
            @gregskril
          </a>
        </small>
        <small>
          See updates to this list on Twitter{" "}
          <a href="https://twitter.com/ethleaderboard" target="_blank">
            @ethleaderboard
          </a>
        </small>
      </div>
    </footer>
  );
}
