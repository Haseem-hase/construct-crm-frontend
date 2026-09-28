'use client';

import React, { useState, useRef } from 'react';
import { ProjectImage } from '../types/project.types';
import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { Dialog } from '@/src/components/ui/dialog';

interface ProjectImageManagerProps {
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
}

export function ProjectImageManager({ images, onChange }: ProjectImageManagerProps) {
  const [imageToRemove, setImageToRemove] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newImages: ProjectImage[] = Array.from(e.target.files).map(file => ({
      id: `img-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      alt: file.name,
      isCover: false
    }));

    const allImages = [...images, ...newImages];
    
    // If there was no cover before, make the first new one the cover
    if (!allImages.find(img => img.isCover) && allImages.length > 0) {
      allImages[0].isCover = true;
    }

    onChange(allImages);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSetCover = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(images.map(img => ({
      ...img,
      isCover: img.id === id
    })));
  };

  const handleConfirmRemove = () => {
    if (!imageToRemove) return;
    
    const updatedImages = images.filter(img => img.id !== imageToRemove);
    
    // If we removed the cover, promote the first available image
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isCover)) {
      updatedImages[0].isCover = true;
    }

    onChange(updatedImages);
    setImageToRemove(null);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex !== null && previewIndex < images.length - 1) {
      setPreviewIndex(previewIndex + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewIndex !== null && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Images</CardTitle>
          <div>
            <input 
              type="file" 
              multiple 
              accept="image/jpeg, image/png, image/webp" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleAddImages}
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              + Add Images
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
              No images added yet. Click &quot;Add Images&quot; to upload some.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div 
                  key={img.id} 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group ring-1 ring-neutral-200/50 bg-neutral-100 cursor-pointer"
                  onClick={() => setPreviewIndex(idx)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt || 'Project image'} className="object-cover w-full h-full" />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                    {!img.isCover && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="bg-white/90 text-neutral-900 hover:bg-white border-none h-8 px-3"
                        onClick={(e) => handleSetCover(img.id, e)}
                      >
                        Set Cover
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="h-8 px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageToRemove(img.id);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  {/* Cover Indicator Badge */}
                  {img.isCover && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm z-10 pointer-events-none">
                      Cover
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog 
        open={!!imageToRemove}
        onOpenChange={(open) => !open && setImageToRemove(null)}
        title="Remove project image?"
        description="Are you sure you want to remove this image from the project?"
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={handleConfirmRemove}
        variant="destructive"
      />

      <Dialog 
        open={previewIndex !== null} 
        onOpenChange={(open) => {
          if (!open) setPreviewIndex(null);
        }}
        panelClassName="relative bg-black/95 border-none shadow-2xl rounded-xl w-full max-w-5xl mx-4 p-2 outline-none flex items-center justify-center"
      >
        {previewIndex !== null && (
          <div className="relative flex items-center justify-center w-full min-h-[300px] sm:min-h-[600px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={images[previewIndex].url}
              alt={images[previewIndex].alt || 'Project image preview'}
              className="max-w-full max-h-[85vh] object-contain rounded-md"
            />
            
            {previewIndex > 0 && (
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
            
            {previewIndex < images.length - 1 && (
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
          </div>
        )}
      </Dialog>
    </>
  );
}
