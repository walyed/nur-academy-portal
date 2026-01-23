interface StarRatingProps {
  rating: number;
}

export default function StarRating({ rating }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  
  return (
    <span style={{ color: 'hsl(45 90% 48%)' }}>
      {'★'.repeat(fullStars)}
      {hasHalf ? '½' : ''}
      {'☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0))}
      <span style={{ color: 'hsl(220 10% 50%)', marginLeft: '6px' }}>
        ({rating.toFixed(1)})
      </span>
    </span>
  );
}
