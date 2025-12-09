import { Tag } from "@/types/types";
import Link from "next/link";

function TagBlob({ content }: { content: string; }) {
  return (
    <span className="tag">
      <Link href={`/products?query=${content}`}>{content}</Link>
    </span>
  );
}

export default function TagList({ tags, limit }: { tags: Tag[]; limit?: number; }) {
  const _tags = [...tags];
  if (limit && Number.isInteger(limit)) {
    _tags.length = limit;
  }
  return (
    <div className="tags">
      {_tags.map(tag => (<TagBlob content={tag.title} key={tag.id} />))}
    </div>
  );
}
