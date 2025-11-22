import { Tag } from "@/app/lib/types";

function TagBlob({content}: {content: string}) {
  return (<span className="tag">{content}</span>);
}

export default function TagList({tags, limit}: {tags: Tag[]; limit?: number}) {
  const _tags = [...tags];
  if(limit && Number.isInteger(limit)) {
    _tags.length = limit;
  }
  return (
    <div className="tags">
      {_tags.map(tag => (<TagBlob content={tag.title} key={tag.id} />))}
    </div>
  );
}
