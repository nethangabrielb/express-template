const setExpiry = () => {
  const now = new Date();

  const expiry = new Date();

  expiry.setMinutes(now.getMinutes() + 10);

  return expiry;
};

export default setExpiry;
