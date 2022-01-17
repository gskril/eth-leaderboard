import footerStyles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.footerContainer}>
        <small>
          Website by{" "}
          <a href="https://twitter.com/gregskril" target="_blank">
            @gregskril
          </a> and{" "}
          <a href="https://twitter.com/taytemss" target="_blank">
            @taytemss
          </a>
        </small>
        <small>
          See updates at{" "}
          <a href="https://twitter.com/ethleaderboard" target="_blank">
            @ethleaderboard
          </a>
        </small>
        <small>
          Initial data from{" "}
          <a href="https://twitter.com/ultrasoundmoney" target="_blank">
            @ultrasoundmoney
          </a>
        </small>
      </div>
    </footer>
  );
}
