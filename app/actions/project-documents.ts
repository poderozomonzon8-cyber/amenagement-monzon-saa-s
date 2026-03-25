'use server'

import { createClient } from '@/lib/supabase/server'

export interface ProjectDocument {
  id: string
  project_id: string
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  category: 'document' | 'contract' | 'photo'
  uploaded_by: string
  uploaded_at: string
}

// Upload document to Supabase Storage
export async function uploadProjectDocument(
  projectId: string,
  file: File,
  category: 'document' | 'contract' | 'photo' = 'document'
): Promise<ProjectDocument> {
  const supabase = await createClient()
  
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const filePath = `${category}/${projectId}/${fileName}`
  
  console.log('[v0] Uploading document:', filePath)
  
  // Upload to storage
  const { data, error: uploadError } = await supabase.storage
    .from('project_docs')
    .upload(filePath, file, { upsert: false })
  
  if (uploadError) {
    console.error('[v0] Upload error:', uploadError.message)
    throw new Error(`Upload failed: ${uploadError.message}`)
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('project_docs')
    .getPublicUrl(filePath)
  
  console.log('[v0] Document uploaded:', publicUrl)
  
  // Save metadata to database
  const { data: document, error: dbError } = await supabase
    .from('project_documents')
    .insert({
      project_id: projectId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_url: publicUrl,
      category,
    })
    .select()
    .limit(1)
  
  if (dbError) {
    console.error('[v0] DB error:', dbError.message)
    throw new Error(`Failed to save document info: ${dbError.message}`)
  }
  
  return (document?.[0] || {}) as ProjectDocument
}

// Get all documents for a project
export async function getProjectDocuments(projectId: string): Promise<ProjectDocument[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('project_documents')
    .select('*')
    .eq('project_id', projectId)
    .order('uploaded_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return (data || []) as ProjectDocument[]
}

// Delete document
export async function deleteProjectDocument(documentId: string, filePath: string): Promise<void> {
  const supabase = await createClient()
  
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('project_docs')
    .remove([filePath])
  
  if (storageError) {
    console.warn('[v0] Storage delete warning:', storageError.message)
  }
  
  // Delete from database
  const { error: dbError } = await supabase
    .from('project_documents')
    .delete()
    .eq('id', documentId)
  
  if (dbError) throw new Error(dbError.message)
}

// Get document download URL
export async function getDocumentDownloadUrl(filePath: string): Promise<string> {
  const supabase = await createClient()
  
  const { data } = supabase.storage
    .from('project_docs')
    .getPublicUrl(filePath)
  
  return data.publicUrl
}
