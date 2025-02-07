const buildInsertQueryPS = (tableName, data) => {
  if (Array.isArray(data) && tableName != "") {
    let query = `INSERT INTO ${tableName} (`;
    let x = 0;
    let buildData = [];

    Object.keys(data[0]).forEach((key) => {
      if (x == 0) {
        query += `${key}`;
      } else {
        query += `,${key}`;
      }
      x++;
    });

    query += `) VALUES `;

    let y = 0;
    let s = 1;
    data.forEach((data) => {
      if (y == 0) {
        query += "(";

        let i = 0;
        Object.keys(data).forEach((key) => {
          buildData.push(data[key]);
          if (i == 0) {
            query += `$${s}`;
          } else {
            query += `,$${s}`;
          }
          i++;
          s++;
        });

        query += `) returning *`;
      } else {
        query += ",(";

        let i = 0;
        Object.keys(data).forEach((key) => {
          buildData.push(data[key]);
          if (i == 0) {
            query += `$${s}`;
          } else {
            query += `,$${s}`;
          }
          i++;
          s++;
        });

        query += `) returning username,password,created_by, created_at`;
      }
      y++;
    });

    return { query, data: buildData };
  } else {
    return { query: null, data: [] };
  }
};

const buildUpdateQueryPS = (
  tableName,
  data,
  condition,
  returnField = "id_seq"
) => {
  if (
    (tableName !== "" && typeof data === "object",
    typeof condition === "object")
  ) {
    let query = `UPDATE ${tableName} SET `;
    let x = 0;
    let s = 1;
    let buildData = [];

    Object.keys(data).forEach((key) => {
      if (x == 0) {
        query += `${key}=$${s}`;
        buildData.push(data[key]);
      } else {
        query += `, ${key}=$${s}`;
        buildData.push(data[key]);
      }
      x++;
      s++;
    });

    query += " WHERE ";

    let z = 0;
    Object.keys(condition).forEach((key) => {
      if (z == 0) {
        query += `${key}=$${s}`;
        buildData.push(condition[key]);
      } else {
        query += ` AND ${key}=$${s}`;
        buildData.push(condition[key]);
      }
      z++;
      s++;
    });

    query += ` RETURNING ${returnField} `;

    return { query, data: buildData };
  } else {
    return { query: null, data: [] };
  }
};

const buildUpdateQueryPS2 = (
  tableName,
  data,
  condition,
  returnField = "id"
) => {
  if (
    (tableName !== "" && typeof data === "object",
    typeof condition === "object")
  ) {
    let query = `UPDATE ${tableName} SET `;
    let x = 0;
    let s = 1;
    let buildData = [];

    Object.keys(data).forEach((key) => {
      if (x == 0) {
        query += `${key}=$${s}`;
        buildData.push(data[key]);
      } else {
        query += `, ${key}=$${s}`;
        buildData.push(data[key]);
      }
      x++;
      s++;
    });

    query += " WHERE ";

    let z = 0;
    Object.keys(condition).forEach((key) => {
      if (z == 0) {
        query += `${key}=$${s}`;
        buildData.push(condition[key]);
      } else {
        query += ` AND ${key}=$${s}`;
        buildData.push(condition[key]);
      }
      z++;
      s++;
    });

    query += ` RETURNING ${returnField} `;

    return { query, data: buildData };
  } else {
    return { query: null, data: [] };
  }
};

const buildUpdateQueryPS3 = (
  tableName,
  data,
  condition,
  returnField = "*"
) => {
  if (
    (tableName !== "" && typeof data === "object",
    typeof condition === "object")
  ) {
    let query = `UPDATE ${tableName} SET `;
    let x = 0;
    let s = 1;
    let buildData = [];

    Object.keys(data).forEach((key) => {
      if (x == 0) {
        query += `${key}=$${s}`;
        buildData.push(data[key]);
      } else {
        query += `, ${key}=$${s}`;
        buildData.push(data[key]);
      }
      x++;
      s++;
    });

    query += " WHERE ";

    let z = 0;
    Object.keys(condition).forEach((key) => {
      if (z == 0) {
        query += `${key}=$${s}`;
        buildData.push(condition[key]);
      } else {
        query += ` AND ${key}=$${s}`;
        buildData.push(condition[key]);
      }
      z++;
      s++;
    });

    query += ` RETURNING ${returnField} `;

    return { query, data: buildData };
  } else {
    return { query: null, data: [] };
  }
};

const buildSearchQuery = (arr) => {
  if (arr.length < 1) {
    return "";
  }
  var querySet = " where ";
  var dataLength = arr.length;
  for (var key in arr) {
    querySet += arr[key];
    if (key != dataLength - 1) {
      querySet += " AND ";
    }
  }
  return querySet;
};

module.exports = {
  buildInsertQueryPS,
  buildUpdateQueryPS,
  buildUpdateQueryPS3,
  buildUpdateQueryPS2,
  buildSearchQuery
};
