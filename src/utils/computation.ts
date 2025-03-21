export const postScore = (
  likes: number,
  comments: number,
  shares: number,
  bookmarks: number,
  views: number
) => {
  return likes * 2 + comments * 3 + shares * 4 + bookmarks * 5 + views * 0.5;
};

export const calculateTrendingScore = (post: {
  likes: number;
  views: number;
  comments: number;
  shares: number;
  bookmarks: number;
  createdAt: string;
}) => {
  const postAgeInHours =
    (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);

  return (
    (post.likes * 2 +
      post.comments * 3 +
      post.shares * 4 +
      post.bookmarks * 5 +
      post.views * 0.5) /
    Math.pow(1 + postAgeInHours, 1.5)
  );
};
