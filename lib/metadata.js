const data = [
  {
    page: "home",
    title: "",
    description:
      "",
    url: "",
    canonical: "",
    robots:
      "index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
  },
];

export const generatemetaData = (meta = {}, openGraph = {}, twitter = {}) => {
  return {
    keywords: meta.keywords?.split?.(","),
    ...meta,
    openGraph: {
      locale: "en",
      type: "website",
      url: "/",
      site_name: "ModAura",
      images: ["/assets/images/swiper/oghome.webp"],
      ...openGraph,
    },
    alternates: {
      canonical: meta.canonical,
    },
    twitter: {
      card: "summary_large_image",
      site: "@modaura",
      image: "/assets/images/swiper/oghome.webp",
      creator: "@modaura",
      ...twitter,
    },
  };
};

export function getMetaData(page) {
  return data.find((obj) => obj.page == page);
}
