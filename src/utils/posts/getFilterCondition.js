/* 
  filters = { adType, category, userId, wilaya, active, numOfPage, numOfAdsPerPage } 
  "numOfPage" and "numOfAdsPerPage" are required whene getting the posts info and not number of posts
*/
const getFilterAdsDBCondition = (filters) => {
  if (Object.keys(filters).length <= 2 && filters.numOfPage) return "";

  let condition = `WHERE`;

  if (filters.adType) condition += ` AND type = '${filters.adType}'`;
  if (filters.category) condition += ` AND category = '${filters.category}'`;
  if (filters.wilaya) condition += ` AND wilaya = '${filters.wilaya}'`;
  if (filters.userId) condition += ` AND user_id = ${filters.userId}`;
  if (filters.active) condition += ` AND active = ${filters.active}`;

  return condition.replace("AND", ""); // remove the first "AND" from the query
};

module.exports = { getFilterAdsDBCondition };
