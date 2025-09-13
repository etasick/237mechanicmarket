import { writeFile } from "fs/promises";
import { SitemapStream, streamToPromise } from "sitemap";
import { sanityClient } from "./lib/sanity.js";


const baseUrl = "https://vendprosupply.com";

const staticPaths = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/about-us", changefreq: "monthly", priority: 0.8 },
  { url: "/contact-us", changefreq: "monthly", priority: 0.8 },
  { url: "/shop", changefreq: "weekly", priority: 0.9 },
];

const fetchDynamicPaths = async () => {
  try {
    const categories = await sanityClient.fetch(`*[_type == "category"]{slug}`);
    const categoryPaths = categories.map((category) => ({
      url: `/collections/${category.slug.current}`,
      changefreq: "weekly",
      priority: 0.9,
    }));

    const products = await sanityClient.fetch(`*[_type == "product"]{slug}`);
    const productPaths = products.map((product) => ({
      url: `/product/${product.slug.current}`,
      changefreq: "weekly",
      priority: 0.8,
    }));

    return [...categoryPaths, ...productPaths];
  } catch (error) {
    console.error("❌ Error fetching dynamic paths from Sanity:", error);
    return [];
  }
};

const generateSitemap = async () => {
  try {
    const dynamicPaths = await fetchDynamicPaths();
    const allPaths = [...staticPaths, ...dynamicPaths];

    const sitemap = new SitemapStream({ hostname: baseUrl });

    allPaths.forEach((path) => sitemap.write(path));
    sitemap.end();

    const xml = await streamToPromise(sitemap).then((data) => data.toString());

    await writeFile("./public/sitemap.xml", xml, "utf-8");
    console.log("✅ Sitemap generated successfully!");
  } catch (err) {
    console.error("❌ Error generating sitemap:", err);
  }
};

generateSitemap();
