import { ElevationQueryParams } from './elevation';

export function mallQuery(ref, { orderBy, where, reverse, limit }: ElevationQueryParams = { }) {
  let query = ref;

  if (orderBy) {
    query = query.orderBy(orderBy, reverse ? 'desc' : 'asc');
  }

  if (limit) {
    query = query.limit(limit);
  }

  if (where) {
    Object.keys(where).forEach(key => {
      if (where[key]) {
        query = query.where(key, '==', where[key]);
      }
    });
  }

  return query;
}
