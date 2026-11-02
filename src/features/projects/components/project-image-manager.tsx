'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ProjectImage } from '../types/project.types';
import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { Dialog } from '@/src/components/ui/dialog';

interface ProjectImageManagerProps {
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  error?: string;
}

export function ProjectImageManager({ images, onChange, error: formError }: ProjectImageManagerProps) {
  const [imageToRemove, setImageToRemove] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  useEffect(() => () => {
    imagesRef.current.forEach(image => { if (image.url.startsWith('blob:')) URL.revokeObjectURL(image.url); });
  }, []);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      setError('Projects can have up to 10 images.');
      e.target.value = '';
      return;
    }
    const invalid = files.find(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024);
    if (invalid) {
      setError(`${invalid.name} must be a JPEG, PNG, or WebP image no larger than 5 MB.`);
      e.target.value = '';
      return;
    }
    const added = files.map((file, index): ProjectImage => ({
      id: `new-${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      alt: file.name,
      file,
      isPersisted: false,
      isCover: false,
    }));
    const allImages = [...images, ...added];
    if (!allImages.some(img => img.isCover) && allImages.length) allImages[0].isCover = true;
    setError('');
    onChange(allImages);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    const value = imageUrl.trim();
    if (!value) return;
    if (images.length >= 10) {
      setError('Projects can have up to 10 images.');
      return;
    }
    try {
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('invalid protocol');
    } catch {
      setError('Enter a valid http or https image URL.');
      return;
    }
    const added: ProjectImage = {
      id: `url-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: value,
      alt: value.split('/').pop() || 'Project image',
      isPersisted: false,
      isCover: images.length === 0,
    };
    onChange([...images, added]);
    setImageUrl('');
    setError('');
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
    const removed = images.find(img => img.id === imageToRemove);
    if (removed?.url.startsWith('blob:')) URL.revokeObjectURL(removed.url);
    const updatedImages = images.filter(img => img.id !== imageToRemove);
    
    // If we removed the cover, promote the first available image
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isCover)) {
      updatedImages[0].isCover = true;
    }

    setPreviewIndex(current => current === null || updatedImages.length === 0 ? null : Math.min(current, updatedImages.length - 1));
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
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              + Add Images
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row">
            <input type="url" value={imageUrl} onChange={event => setImageUrl(event.target.value)} placeholder="https://example.com/project-image.jpg" aria-label="Project image URL" className="h-10 min-w-0 flex-1 rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400" />
            <Button type="button" variant="outline" onClick={handleAddUrl}>Add image URL</Button>
          </div>
          {(error || formError) && <p role="alert" className="mb-4 text-sm text-red-600">{error || formError}</p>}
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
                      <Button type="button"
                        variant="secondary" 
                        size="sm" 
                        className="bg-white/90 text-neutral-900 hover:bg-white border-none h-8 px-3"
                        onClick={(e) => handleSetCover(img.id, e)}
                      >
                        Set Cover
                      </Button>
                    )}
                    <Button type="button"
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
                <Button type="button"
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
              <Button type="button"
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
