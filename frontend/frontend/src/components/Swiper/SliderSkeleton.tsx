const SliderSkeleton = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-200 overflow-hidden">
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" 
             style={{ backgroundSize: '200% 100%' }}></div>
      </div>
      
      {/* Pagination dots skeleton */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full bg-gray-400 bg-opacity-50"></div>
        ))}
      </div>
      
      {/* Navigation arrows skeleton */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 rounded-full bg-gray-400 bg-opacity-50"></div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 rounded-full bg-gray-400 bg-opacity-50"></div>
    </div>
  );
};

export default SliderSkeleton;