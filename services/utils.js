export const errorHandler = (e) => {
  console.error('AUTH API ERROR');
  console.error(e);
};

export const addAuth = (token) => {
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};
