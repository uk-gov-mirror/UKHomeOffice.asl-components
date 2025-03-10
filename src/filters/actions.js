const { queryStringFromState } = require('../utils');
const { fetchItems } = require('../actions');
const merge = require('lodash/merge');
const get = require('lodash/get');

const setFilters = filters => ({
  type: 'SET_FILTERS',
  filters
});

const changeFilters = filters => (dispatch, getState) => {
  const state = getState();
  const searchFilter = get(state, 'datatable.filters.active[*]');

  if (searchFilter) {
    filters['*'] = searchFilter;
  }

  const query = queryStringFromState(merge({}, state, {
    datatable: { filters: { active: filters } }
  }));

  return fetchItems(`${state.static.url}?${query}`, dispatch)
    .then(() => dispatch(setFilters(filters)));
};

module.exports = {
  changeFilters
};
