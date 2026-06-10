const DEFAULT_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 300;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withFirebaseRetry<T>(
  operation: () => Promise<T>,
  options: { retries?: number; baseDelayMs?: number; label?: string } = {}
): Promise<T> {
  const retries = options.retries ?? DEFAULT_RETRIES;
  const baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;

      const jitter = Math.floor(Math.random() * 100);
      await wait(baseDelayMs * 2 ** attempt + jitter);
    }
  }

  if (options.label) {
    console.error(`${options.label} failed after ${retries + 1} attempts`, lastError);
  }
  throw lastError;
}
