
declare module 'react-rating-stars-component' {
  import * as React from 'react';

  interface ReactStarsProps {
    count: number;
    size: number;
    value: number;
    isHalf: boolean;
    activeColor: string;
    edit: boolean;
    onChange?: (newRating: number) => void;
    [key: string]: any;
  }

  const ReactStars: React.FC<ReactStarsProps>;
  export default ReactStars;
}