export const seo = ({
  title,
  description,
  keywords,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
}) => {
  const tags = [
    { title },
    { property: "description", content: description },
    { property: "keywords", content: keywords },
    { property: "twitter:title", content: title },
    { property: "twitter:description", content: description },
    { property: "twitter:creator", content: "@shahankk42" },
    { property: "twitter:site", content: "@sophist_ai" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:locale", content: "en-IN" },
    { property: "og:url", content: "https://sophistai.app" },
    { property: "og:logo", content: "https://sophistai.app/logo.png" },

    { property: "og:description", content: description },
    ...(image !== undefined
      ? [
          { property: "twitter:image", content: image },
          { property: "twitter:card", content: "summary_large_image" },
          { property: "og:image", content: image },
        ]
      : []),
  ];

  return tags;
};
