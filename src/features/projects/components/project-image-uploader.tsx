'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { ProjectImageManager } from './project-image-manager';
import type { ProjectImage } from '../types/project.types';
import { projectsApi, type ProjectGalleryItem } from '../api/projects.api';
import { updateProject } from '../store/projectsSlice';
import { useAppDispatch } from '@/src/store/hooks';

export function ProjectImageUploader({ projectId, onSaved }: { projectId: string; onSaved: () => void }) {
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving || !images.length) return;
    setSaving(true);
    setError('');
    try {
      // Read the current gallery immediately before adding photos, preserving existing images.
      const project = await projectsApi.get(projectId);
      const existing: ProjectGalleryItem[] = project.images?.length
        ? project.images.map(image => ({ source: 'existing', id: image.id, isCover: image.isCover }))
        : project.imageUrl ? [{ source: 'url', url: project.imageUrl, isCover: true }] : [];
      if (existing.length + images.length > 200) throw new Error('Projects can have up to 200 images.');
      const files = images.flatMap(image => image.file ? [image.file] : []);
      const additions: ProjectGalleryItem[] = images.map(image => {
        const details = { kind: image.kind || 'DESIGN' as const, visitedAt: image.visitedAt || null, siteStage: image.siteStage || null, notes: image.notes || null, alt: image.alt, isCover: existing.length === 0 && !!image.isCover };
        return image.file
          ? { ...details, source: 'upload', uploadIndex: files.indexOf(image.file) }
          : { ...details, source: 'url', url: image.url };
      });
      await dispatch(updateProject({ id: projectId, payload: { imageGallery: [...existing, ...additions], images: files } })).unwrap();
      onSaved();
    } catch (error: unknown) {
      setError(typeof error === 'string' ? error : error instanceof Error ? error.message : 'Unable to add images. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="sticky top-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-neutral-600">{images.length ? `${images.length} image${images.length === 1 ? '' : 's'} ready to submit` : 'Add images below, then submit to save them.'}</p>
        <Button type="submit" disabled={saving || images.length === 0} isLoading={saving}>Submit images</Button>
      </div>
      <fieldset disabled={saving} className="min-w-0">
        <ProjectImageManager images={images} onChange={setImages} />
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={saving || images.length === 0} isLoading={saving}>Submit images</Button>
      </div>
    </form>
  );
}
