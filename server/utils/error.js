exports.errTemp = (msg = "An error occurred", status = 500, data = []) => {
  const error = new Error(msg);
  error.statusCode = status;
  error.data = data;
  throw error;
};
