module.exports = {
  response: (response, status, msg, data, pagination) => {
    const result = {};
    result.status = status || 200;
    result.message = msg;
    result.result = data;
    result.pagination = pagination;

    return response.status(result.status).json(result);
  },
};
