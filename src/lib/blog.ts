import { allPosts } from "content-collections";

export const blogPosts = [...allPosts].sort(
  (a, b) => b.publishedAt.localeCompare(a.publishedAt),
);
