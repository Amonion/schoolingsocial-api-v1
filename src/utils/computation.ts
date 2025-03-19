export const postScore = (
  likes: number,
  comments: number,
  shares: number,
  bookmarks: number,
  views: number,
  following: number
) => {
  return (
    likes * 2 +
    comments * 3 +
    shares * 4 +
    bookmarks * 5 +
    views * 0.5 +
    following * 10
  );
};
