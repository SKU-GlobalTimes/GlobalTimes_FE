import PropTypes from "prop-types";
import { RotateCcw } from "lucide-react";
import TranslatedText from "../../../api/TranslatedText";
import styles from "./ApiErrorMessage.module.css";

export default function ApiErrorMessage({ message, onRetry = null }) {
  if (!message) return null;

  return (
    <div className={styles.notice} role="alert">
      <p>
        <TranslatedText text={message} />
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} title="다시 시도">
          <RotateCcw size={16} aria-hidden />
          <TranslatedText text="다시 시도" />
        </button>
      )}
    </div>
  );
}

ApiErrorMessage.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};
