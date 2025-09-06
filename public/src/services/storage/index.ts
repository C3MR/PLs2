import { StorageProvider, SupportedProvider, StorageConfig } from './StorageProvider';
import { SupabaseStorageProvider } from './SupabaseStorage';

// يمكن إضافة مقدمين آخرين هنا مستقبلاً
// import { AWSStorageProvider } from './AWSStorage';
// import { GoogleCloudStorageProvider } from './GoogleCloudStorage';

class StorageService {
  private provider: StorageProvider;
  private config: StorageConfig;

  constructor(config: StorageConfig = { provider: 'supabase' }) {
    this.config = config;
    this.provider = this.createProvider(config.provider);
  }

  private createProvider(providerName: SupportedProvider): StorageProvider {
    switch (providerName) {
      case 'supabase':
        return new SupabaseStorageProvider();
      // يمكن إضافة مقدمين آخرين هنا
      // case 'aws-s3':
      //   return new AWSStorageProvider();
      // case 'google-cloud':
      //   return new GoogleCloudStorageProvider();
      default:
        throw new Error(`مقدم التخزين غير مدعوم: ${providerName}`);
    }
  }

  // تغيير المقدم أثناء التشغيل
  switchProvider(providerName: SupportedProvider) {
    this.config.provider = providerName;
    this.provider = this.createProvider(providerName);
  }

  // Delegate all methods to the current provider
  upload(...args: Parameters<StorageProvider['upload']>) {
    return this.provider.upload(...args);
  }

  delete(...args: Parameters<StorageProvider['delete']>) {
    return this.provider.delete(...args);
  }

  getUrl(...args: Parameters<StorageProvider['getUrl']>) {
    return this.provider.getUrl(...args);
  }

  getSignedUrl(...args: Parameters<StorageProvider['getSignedUrl']>) {
    return this.provider.getSignedUrl(...args);
  }

  listFiles(...args: Parameters<StorageProvider['listFiles']>) {
    return this.provider.listFiles(...args);
  }

  getProviderInfo() {
    return {
      name: this.provider.getProviderName(),
      configured: this.provider.isConfigured(),
      current: this.config.provider
    };
  }
}

// تصدير نسخة واحدة للاستخدام في التطبيق
export const storageService = new StorageService();

// تصدير الأنواع
export * from './StorageProvider';