import fetch from 'isomorphic-unfetch';

const apiCache = new Map<RequestInfo, any>();

async function fetchResource(req: RequestInfo, opts?: RequestInit) {
  if (apiCache.has(req)) return apiCache.get(req);

  const response = await fetch(req, opts);
  const resource = await response.json();

  if (process.browser) apiCache.set(req, resource);

  return resource;
}

export default fetchResource;
