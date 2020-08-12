class QueryBuilder {
  constructor(query, reqQuery) {
    this._query = query;
    this._reqQuery = reqQuery;
  }

  get query() {
    return this._query;
  }

  filter() {
    let queryObj = { ...this._reqQuery };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);

    this._query = this._query.find(queryObj);

    return this;
  }

  sort() {
    let sortBy;
    if (this._reqQuery.sort) {
      sortBy = this._reqQuery.sort.split(',').join(' ');
    } else {
      sortBy = '-ratingsAverage -ratingsQuantity';
    }
    this._query = this._query.sort(sortBy);

    return this;
  }

  limitFields() {
    let fields = '';
    if (this._reqQuery.fields) {
      fields = this._reqQuery.fields.split(',').join(' ');
    } else {
      fields = fields.concat('-__v');
    }

    // Removes '__v' field from query
    // ERROR: Cannot have a mix of inclusion and exclusion
    // if (!fields.includes('-__v')) {
    //   if (fields.includes('__v')) {
    //     fields = fields.replace('__v', '-__v');
    //   } else {
    //     fields = fields.concat(' -__v');
    //   }
    // }
    this._query = this._query.select(fields);

    return this;
  }

  paginate() {
    let page = parseInt(this._reqQuery.page, 10) || 1;
    let lim = parseInt(this._reqQuery.limit, 10) || 10;
    if (page < 1) {
      page = 1;
    }
    if (lim < 1) {
      lim = 1;
    }

    const skip = (page - 1) * lim;

    // Do not need to throw error
    // const numTours = await Tour.countDocuments();
    // if (skip >= numTours) {
    //   throw new Error('This page does not exist');
    // }

    this._query = this._query.skip(skip).limit(lim);

    return this;
  }
}

module.exports = QueryBuilder;
