export const runtime = 'experimental-edge';

import Head from "next/head";
import ProductList from "@/components/ProductList";
import { sanityClient } from "@/lib/sanity"; // Ensure you have a configured Sanity client

// getStaticPaths: Fetch all category slugs from Sanity for static generation.
export async function getStaticPaths() {
  const query = `*[_type == "category"]{slug}`;
  const categories = await sanityClient.fetch(query);

  return {
    paths: categories.map((cat) => ({ params: { slug: cat.slug.current } })),
    fallback: "blocking",
  };
}

// getStaticProps: Fetches category data and related products from Sanity.
export async function getStaticProps({ params }) {
  const { slug } = params;

  try {
    const query = `
      *[_type == "category" && slug.current == $slug][0]{
        name,
        description,
        "products": *[_type == "product" && references(^._id)]{
          _id,
          name,
          price,
          "slug": slug.current,
          "picture": picture,
          "reviews": *[_type == "review" && references(^._id) && approved == true]{
            rating
          }
        }
      }
    `;

    const category = await sanityClient.fetch(query, { slug });

    if (!category) return { notFound: true };

    return {
      props: {
        category,
        products: category.products || [],
        slug,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
    return { notFound: true };
  }
}

const CategoryPage = ({ category, products, slug }) => {
  return (
    <div className="category-page container mx-auto px-4 py-8">
      <Head>
        <title>{category.name} | Vend Pro Supply</title>
        <meta name="description" content={category.description} />
        <link rel="canonical" href={`https://vendprosupply.com/collections/${slug}`} />
        <link rel="icon" href="https://www.butterflyassets.online/vendprosupply.png" />
        <link rel="apple-touch-icon" href="https://www.butterflyassets.online/vendprosupply.png" />
      </Head>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">{category.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{category.description}</p>
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Products in "{category.name}"
        </h2>
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <p className="text-center text-gray-500">No products available for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
