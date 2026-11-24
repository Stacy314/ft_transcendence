import { getApiError } from '../services/api';

export default function PetLoadError({ error, isRetrying, onRetry }) {
  return (
    <>
      <p role="alert">{getApiError(error).message}</p>
      <button type="button" disabled={isRetrying} onClick={() => onRetry()}>
        Try again
      </button>
    </>
  );
}
