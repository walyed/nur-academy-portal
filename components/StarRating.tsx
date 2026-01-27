interface StarRatingProps {
  rating: number;
}

export default function StarRating({ rating }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      <span style={{ color: 'hsl(45 95% 50%)', letterSpacing: '1px' }}>
        {'★'.repeat(fullStars)}
        {hasHalf ? '⯨' : ''}
        <span style={{ opacity: 0.3 }}>{'★'.repeat(5 - fullStars - (hasHalf ? 1 : 0))}</span>
      </span>
      <span style={{ 
        color: 'hsl(220 10% 45%)', 
        marginLeft: '4px',
        fontSize: '13px',
        fontWeight: 500
      }}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
}
