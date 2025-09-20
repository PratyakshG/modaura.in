const data = [
  {
    page: "home",
    title: "Sagenext: A Reliable Cloud Hosting Service Provider",
    description:
      "One of the best cloud hosting providers, Sagenext specializes in hosting tax and accounting software at the most reasonable prices.",
    url: "https://www.thesagenext.com",
    canonical: "https://www.thesagenext.com",
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
      site: "@InfoHexabells",
      image: "/assets/images/swiper/oghome.webp",
      creator: "@InfoHexabells",
      ...twitter,
    },
  };
};

export function getMetaData(page) {
  return data.find((obj) => obj.page == page);
}
