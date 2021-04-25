async function fetchResource(req: RequestInfo, opts?: RequestInit) {
  const response = await fetch(req, opts);
  const resource = await response.json();

  return resource;
}

export default fetchResource;
