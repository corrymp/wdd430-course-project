'use client';
import { JSX, useState } from "react";
import '@/app/ui/gallery.css'

export default function Gallery({ items, classes, show='4' }: { items: JSX.Element[]; classes?: string; show?: string }) {
  const jump = show ? Number(show) : 4;
  const [index, setIndex] = useState(0);

  const rangedIndex = index % items.length;
  const offsetItems = [
    ...items.slice(rangedIndex),
    ...items.slice(0, rangedIndex)
  ];

  return (
    <div className={"gallery"+(classes ? ' ' + classes : '')} data-show={show}>
      <ol className="gallery-items">
        {offsetItems.map((item, i) => (
          <li className="gallery-item" key={i}>{item}</li>
        ))}
      </ol>

      <div className="gallery-btns">
        <button 
          className="gallery-btn gallery-left" 
          onClick={() => setIndex(index - jump)}
        >&lt;</button>

        {items.map((_, i) => (
        <button 
          className="gallery-btn gallery-jump" 
          onClick={() => setIndex(i)} 
          key={i}
        >{i + 1}</button>
        ))}

        <button 
          className="gallery-btn gallery-right" 
          onClick={() => setIndex(index + jump)}
        >&gt;</button>
      </div>
    </div>
  );
}
