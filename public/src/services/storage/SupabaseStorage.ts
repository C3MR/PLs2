import { supabase } from '@/integrations/supabase/client';
import { StorageProvider, FileUploadOptions, FileMetadata, UploadResult } from './StorageProvider';

export class SupabaseStorageProvider implements StorageProvider {
  getProviderName(): string {
    return 'Supabase Storage';
  }

  isConfigured(): boolean {
    return true; // Supabase is always configured in Lovable
  }

  async upload(file: File, options: FileUploadOptions): Promise<UploadResult> {
    try {
      // Generate unique file path
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomId}.${fileExt}`;
      const filePath = options.path ? `${options.path}/${fileName}` : fileName;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: options.cacheControl || '3600',
          upsert: options.upsert || false,
          contentType: options.contentType || file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath);

      // Save metadata to database
      const { data: user } = await supabase.auth.getUser();
      await supabase.from('file_metadata').insert({
        file_path: filePath,
        bucket_id: options.bucket,
        original_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: user.user?.id
      });

      return {
        success: true,
        data: {
          id: data.id || randomId,
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicUrl,
          path: filePath,
          bucket: options.bucket,
          uploadedAt: new Date(),
          uploadedBy: user.user?.id
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'فشل في رفع الملف'
      };
    }
  }

  async delete(bucket: string, path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;

      // Delete metadata from database
      await supabase.from('file_metadata')
        .delete()
        .eq('file_path', path)
        .eq('bucket_id', bucket);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'فشل في حذف الملف'
      };
    }
  }

  async getUrl(bucket: string, path: string): Promise<string | null> {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      return data.publicUrl;
    } catch {
      return null;
    }
  }

  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);
      
      if (error) throw error;
      return data.signedUrl;
    } catch {
      return null;
    }
  }

  async listFiles(bucket: string, path?: string): Promise<FileMetadata[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path);

      if (error) throw error;

      // Get metadata from database
      const { data: metadata } = await supabase
        .from('file_metadata')
        .select('*')
        .eq('bucket_id', bucket);

      return (data || []).map(file => {
        const meta = metadata?.find(m => m.file_path.endsWith(file.name));
        const filePath = path ? `${path}/${file.name}` : file.name;
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);

        return {
          id: file.id || file.name,
          name: meta?.original_name || file.name,
          size: meta?.file_size || 0,
          type: meta?.mime_type || '',
          url: publicUrl,
          path: filePath,
          bucket,
          uploadedAt: new Date(meta?.created_at || file.created_at),
          uploadedBy: meta?.uploaded_by
        };
      });
    } catch {
      return [];
    }
  }
}