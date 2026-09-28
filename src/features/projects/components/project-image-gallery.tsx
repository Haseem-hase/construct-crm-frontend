'use client';

import React, { useState } from 'react';
import { ProjectImage } from '../types/project.types';
import { Dialog } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';

interface ProjectImageGalleryProps {
  images?: ProjectImage[];
}

export function ProjectImageGallery({ images }: ProjectImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  // For the gallery view, we might want to exclude the cover if it's already displayed huge at the top.
  // But let's show all of them (or non-cover ones) depending on design. We'll show all here for a complete gallery.
  const galleryImages = images.filter(img => !img.isCover);
  
  if (galleryImages.length === 0) return null;

  const maxVisible = 4;
  const visibleImages = galleryImages.slice(0, maxVisible);
  const hiddenCount = galleryImages.length - maxVisible;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && selectedImageIndex < galleryImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  return (
    <>
      <div className="w-full">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900 mb-4">Project Gallery</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {visibleImages.map((img, index) => (
            <div 
              key={img.id} 
              className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group ring-1 ring-neutral-200/50"
              onClick={() => setSelectedImageIndex(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img.url} 
                alt={img.alt || 'Project gallery image'} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              
              {/* Overlay for remaining images indicator */}
              {index === maxVisible - 1 && hiddenCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-white font-medium text-lg">+{hiddenCount} more</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog 
        open={selectedImageIndex !== null} 
        onOpenChange={(open) => {
          if (!open) setSelectedImageIndex(null);
        }}
        panelClassName="relative bg-black/95 border-none shadow-2xl rounded-xl w-full max-w-5xl mx-4 p-2 outline-none flex items-center justify-center"
      >
        {selectedImageIndex !== null && (
          <div className="relative flex items-center justify-center w-full min-h-[300px] sm:min-h-[600px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={galleryImages[selectedImageIndex].url}
              alt={galleryImages[selectedImageIndex].alt || 'Project image preview'}
              className="max-w-full max-h-[85vh] object-contain rounded-md"
            />
            
            {selectedImageIndex > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute left-2 text-white hover:bg-white/20 h-10 w-10 rounded-full p-0"
                onClick={handlePrev}
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            )}
            
            {selectedImageIndex < galleryImages.length - 1 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute right-2 text-white hover:bg-white/20 h-10 w-10 rounded-full p-0"
                onClick={handleNext}
                aria-label="Next image"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            )}

            {galleryImages[selectedImageIndex].alt && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="bg-black/60 text-white text-sm py-1.5 px-4 rounded-full backdrop-blur-md">
                  {galleryImages[selectedImageIndex].alt}
                </span>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </>
  );
}
