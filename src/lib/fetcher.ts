const fetcher = async <T, U = undefined>(
  url: string,
  method: string = 'GET',
  body: U = undefined as U,
  headers: HeadersInit = {},
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export default fetcher;
