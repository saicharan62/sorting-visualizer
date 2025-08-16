import React, { useEffect, useRef, useState } from 'react';
import '../styles.css';

function Section({ id, title, children, showParticles = false }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  // Title animation (unchanged from your logic)
  const words = title.split(' ').map((word, i) => (
    <span className="word" key={i}>
      {word.split('').map((letter, j) => (
        <span
          key={j}
          className={`letter ${visible ? 'visible' : ''}`}
          style={{ transitionDelay: `${i * 0.3 + j * 0.05}s` }}
        >
          {letter}
        </span>
      ))}
      &nbsp;
    </span>
  ));

  return (
    <section
      id={id}
      ref={ref}
      className="section"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Optional section-level particles */}
      {showParticles && (
        <div className="section-particles">
          {/* We'll hook in your particle canvas here later */}
        </div>
      )}

      <h2 className="section-title">{words}</h2>
      <div className={`section-content ${visible ? 'visible' : ''}`}>
        {children}
      </div>
    </section>
  );
}

export default Section;
