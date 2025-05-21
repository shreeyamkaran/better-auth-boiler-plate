export function getValidDomains() {
  const domains = ['gmail.com', 'yahoo.com'];
  if (process.env.NODE_ENV == 'development') {
    domains.push('example.com');
  }
  return domains;
}
