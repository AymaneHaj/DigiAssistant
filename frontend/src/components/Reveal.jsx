import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const Reveal = ({ children, direction = 'up', delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getInitialPosition = () => {
    switch (direction) {
      case 'left':
        return { x: -50, opacity: 0 };
      case 'right':
        return { x: 50, opacity: 0 };
      case 'up':
        return { y: 50, opacity: 0 };
      case 'down':
        return { y: -50, opacity: 0 };
      case 'scale':
        return { scale: 0.8, opacity: 0 };
      default:
        return { y: 50, opacity: 0 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 };
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 };
      case 'scale':
        return { scale: 1, opacity: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={isVisible ? getAnimatePosition() : getInitialPosition()}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;

