export const formatReviewCount = (count) => {
  if (count === undefined || count === null) {
    return ""; // Or "No reviews" or similar, based on your preference
  }
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return String(count);
};