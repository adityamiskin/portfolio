import { describe, expect, it } from "vite-plus/test";
import { formatBlogDate, formatBlogDateShort, toIsoDate } from "@/lib/blog-dates";
import { getBlogReadingMinutes, getOptimizedCloudinaryUrl } from "@/lib/utils";

describe("blog date utilities", () => {
  it("parses the date formats used by blog frontmatter", () => {
    expect(toIsoDate("December 27, 2025")).toBe("2025-12-27");
    expect(toIsoDate("dec 27, 2025")).toBe("2025-12-27");
    expect(toIsoDate("2025-12-27")).toBe("2025-12-27");
    expect(toIsoDate("feb 30, 2025")).toBeNull();
  });

  it("formats long and short dates consistently", () => {
    expect(formatBlogDate("2025-12-27")).toBe("December 27, 2025");
    expect(formatBlogDateShort("2025-12-27")).toBe("dec 27, 2025");
  });

  it("never reports less than one reading minute", () => {
    expect(getBlogReadingMinutes("hello")).toBe(1);
    expect(getBlogReadingMinutes("word ".repeat(400))).toBe(2);
  });
});

describe("Cloudinary URL optimization", () => {
  it("adds image transformations without changing the public ID", () => {
    expect(
      getOptimizedCloudinaryUrl(
        "https://res.cloudinary.com/demo/image/upload/v123/photos/example.jpg",
        { width: 1200 },
      ),
    ).toBe(
      "https://res.cloudinary.com/demo/image/upload/c_limit,w_1200,f_auto,q_auto/v123/photos/example.jpg",
    );
  });

  it("leaves non-Cloudinary URLs unchanged", () => {
    const url = "https://example.com/photo.jpg";
    expect(getOptimizedCloudinaryUrl(url)).toBe(url);
  });
});
