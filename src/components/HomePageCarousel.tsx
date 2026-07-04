'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

export type CarouselItem = {
  tag: string;
  title: string;
  desc: string;
  bg: string;
  btn: string;
  link?: string;
};

export default function HomePageCarousel({ items }: { items: CarouselItem[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % items.length);
  }, [items.length]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
  }, []);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next, items.length]);

  if (items.length === 0) return null;

  return (
    <div
      className="carousel-slides"
      id="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={`carousel-slide ${i === current ? 'active' : ''}`}
          style={{ cursor: item.link ? 'pointer' : 'default' }}
          onClick={() => {
            if (item.link && typeof window !== 'undefined') {
              window.location.href = item.link;
            }
          }}
        >
          <div className={`carousel-bg ${item.bg}`}></div>
          <div className="slide-content">
            <span className="carousel-tag">{item.tag}</span>
            <h3 className="carousel-title">{item.title}</h3>
            <p className="carousel-desc">{item.desc}</p>
            {item.link ? (
              <Link
                href={item.link}
                className="carousel-btn"
                onClick={(e) => e.stopPropagation()}
              >
                {item.btn} →
              </Link>
            ) : (
              <span className="carousel-btn">{item.btn} →</span>
            )}
          </div>
        </div>
      ))}
      <div className="carousel-dots" id="dots">
        {items.map((_, i) => (
          <span
            key={i}
            className={i === current ? 'active' : ''}
            onClick={(e) => {
              e.stopPropagation();
              goTo(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}
