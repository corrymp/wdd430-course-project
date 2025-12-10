import { Tag } from "@/types/types";

export default function RelatedSection({ tags }: { tags: Tag[]; }) {
  // TODO: make list of related items based off tags
  console.warn('TODO: use these:', tags);
  return (
    <section className="p-related">
      <h3 style={{ margin: 0, fontWeight: 600 }}>Related products</h3>
      <div className="p-related-grid" style={{ marginTop: 12 }}>
        <div className="p-related-item">Product A</div>
        <div className="p-related-item">Product B</div>
        <div className="p-related-item">Product C</div>
        <div className="p-related-item">Product D</div>
      </div>
    </section>
  );
}