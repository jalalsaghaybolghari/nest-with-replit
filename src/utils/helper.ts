export function handleAsync<T>(fn: () => Promise<T>, customErrorHandler?: (error: any) => void): Promise<T> {
  return fn().catch((error) => {
    if (customErrorHandler) {
      throw customErrorHandler(error);
    }
    throw error;
  });
}

export const getAccessToken = (req: Request): string | null => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;

  const [type, token] = authHeader.split(' ');
  return type === 'Bearer' && token ? token : null;
};