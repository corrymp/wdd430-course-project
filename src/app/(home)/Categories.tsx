'use server';

import { fetchTags } from "@/app/lib/data";
import { Tag } from "@/types/types";
import CategoryList from "@/app/(home)/CategoryList";

const getCategories = (() => {
  let categories: Array<Tag>;
  return async function() {
    if (categories) return categories;
    const cat = await fetchTags();
    categories = cat;
    return categories;
  };
})();

export default async function Categories() {
  const categories = await getCategories();
  return (
    <section className="home-section categories-wrapper">
      <h2>Explore Categories</h2>
      <CategoryList categories={categories} />
    </section>
  );
}
