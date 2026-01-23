import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from './utils';

interface ElegantGridScrollbarProps {
  containerRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export const ElegantGridScrollbar: React.FC<ElegantGridScrollbarProps> = ({
  containerRef,
  className
}) => {
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ y: number; scrollTop: number } | null>(null);

  // Calculate thumb dimensions and visibility
  const updateThumbDimensions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollHeight, clientHeight } = container;
    const hasOverflow = scrollHeight > clientHeight;
    
    setIsVisible(hasOverflow);
    
    if (hasOverflow) {
      const ratio = clientHeight / scrollHeight;
      const minThumbHeight = 30; // Minimum thumb height in pixels
      const calculatedHeight = Math.max(ratio * clientHeight, minThumbHeight);
      setThumbHeight(calculatedHeight);
    }
  }, [containerRef]);

  // Update thumb position on scroll
  const updateThumbPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container || !isVisible) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollableHeight = scrollHeight - clientHeight;
    const trackHeight = clientHeight - thumbHeight;
    
    if (scrollableHeight > 0 && trackHeight > 0) {
      const scrollRatio = scrollTop / scrollableHeight;
      setThumbTop(scrollRatio * trackHeight);
    }
  }, [containerRef, isVisible, thumbHeight]);

  // Initialize and watch for size changes
  useEffect(() => {
    // Initial calculation after mount with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateThumbDimensions, 10);
    
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to batch updates
      requestAnimationFrame(updateThumbDimensions);
    });
    resizeObserver.observe(container);

    // Also observe content changes via MutationObserver
    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(updateThumbDimensions);
    });
    mutationObserver.observe(container, { childList: true, subtree: true });

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [updateThumbDimensions]);

  // Track scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => updateThumbPosition();
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial position
    updateThumbPosition();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, updateThumbPosition]);

  // Handle thumb drag
  const handleThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;

    setIsDragging(true);
    dragStartRef.current = {
      y: e.clientY,
      scrollTop: container.scrollTop
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current || !containerRef.current) return;

      const deltaY = moveEvent.clientY - dragStartRef.current.y;
      const { scrollHeight, clientHeight } = containerRef.current;
      const trackHeight = clientHeight - thumbHeight;
      const scrollableHeight = scrollHeight - clientHeight;
      
      if (trackHeight > 0) {
        const scrollDelta = (deltaY / trackHeight) * scrollableHeight;
        containerRef.current.scrollTop = dragStartRef.current.scrollTop + scrollDelta;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [containerRef, thumbHeight]);

  // Handle track click to jump
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Don't handle if clicking on thumb
    if ((e.target as HTMLElement).classList.contains('custom-scrollbar-thumb')) return;

    const trackRect = track.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    const { scrollHeight, clientHeight } = container;
    const trackHeight = clientHeight;
    
    // Calculate target scroll position (center thumb on click)
    const targetRatio = (clickY - thumbHeight / 2) / (trackHeight - thumbHeight);
    const clampedRatio = Math.max(0, Math.min(1, targetRatio));
    const targetScrollTop = clampedRatio * (scrollHeight - clientHeight);
    
    container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
  }, [containerRef, thumbHeight]);

  if (!isVisible) return null;

  const showScrollbar = isHovered || isDragging;

  return (
    <div
      ref={trackRef}
      className={cn('custom-scrollbar-track', showScrollbar && 'active', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleTrackClick}
    >
      <div
        className={cn('custom-scrollbar-thumb', isDragging && 'dragging')}
        style={{
          height: thumbHeight,
          top: thumbTop,
        }}
        onMouseDown={handleThumbMouseDown}
      />
    </div>
  );
};
