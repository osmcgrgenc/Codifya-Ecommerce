'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImportResult } from '@/services/import-service';
import {
  CheckCircle,
  XCircle,
  Upload,
  Download,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

// Alert komponenti
const Alert = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 rounded-md ${className}`}>{children}</div>
);

const AlertTitle = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <h5 className={`text-lg font-semibold mb-1 ${className}`}>{children}</h5>;

const AlertDescription = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`text-sm ${className}`}>{children}</div>;

// Progress komponenti
const Progress = ({ value = 0, className = '' }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
  </div>
);

// İçe aktarma tipi
type ImportType = 'products' | 'categories' | 'brands' | 'variants';

// İçe aktarma tipi başlıkları
const importTypeLabels: Record<ImportType, string> = {
  products: 'Ürünleri İçe Aktar',
  categories: 'Kategorileri İçe Aktar',
  brands: 'Markaları İçe Aktar',
  variants: 'Varyantları İçe Aktar',
};

// İçe aktarma tipi açıklamaları
const importTypeDescriptions: Record<ImportType, string> = {
  products: 'Ürün adı, açıklama, fiyat, stok, kategori, marka gibi bilgileri içerir.',
  categories: 'Kategori adı, açıklama, üst kategori gibi bilgileri içerir.',
  brands: 'Marka adı, açıklama, web sitesi gibi bilgileri içerir.',
  variants: 'Ürün SKU, varyant adı, fiyat, stok, özellikler gibi bilgileri içerir.',
};

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState<ImportType>('products');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setResult(null);
    setShowErrors(false);

    try {
      // Dosyayı FormData olarak hazırla
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', activeTab);

      // Simüle edilmiş ilerleme
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // API'ye gönder
      const response = await fetch(`/api/admin/import/${activeTab}`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('İçe aktarma sırasında bir hata oluştu');
      }

      const data = await response.json();
      setUploadProgress(100);
      setResult(data);

      if (data.success) {
        toast.success(`${data.successCount} kayıt başarıyla içe aktarıldı`);
      } else {
        toast.error(`İçe aktarma sırasında hata oluştu: ${data.message}`);
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'İçe aktarma sırasında bir hata oluştu',
        totalProcessed: 0,
        successCount: 0,
        errorCount: 1,
        errors: [error.message || 'Bilinmeyen hata'],
      });
      toast.error(`İçe aktarma sırasında hata oluştu: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(`/api/admin/import/template/${activeTab}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Şablon indirme sırasında bir hata oluştu');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}_template.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Şablon başarıyla indirildi');
    } catch (error: any) {
      toast.error(`Şablon indirme hatası: ${error.message}`);
    }
  };

  // Dosya yükleme alanı
  const renderFileUploadArea = () => (
    <div className="mb-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-500 mb-4">
          Excel dosyasını sürükleyip bırakın veya dosya seçin
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          className="hidden"
          disabled={isUploading}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full sm:w-auto"
        >
          <Upload className="mr-2 h-4 w-4" />
          Dosya Seç
        </Button>
      </div>
    </div>
  );

  // Yükleme durumu
  const renderUploadProgress = () =>
    isUploading && (
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Yükleniyor... {uploadProgress}%</p>
        <Progress value={uploadProgress} className="h-2" />
      </div>
    );

  // Sonuç bildirimi
  const renderResultAlert = () =>
    result && (
      <Alert
        className={`mb-6 ${
          result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}
      >
        {result.success ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )}
        <AlertTitle className={result.success ? 'text-green-800' : 'text-red-800'}>
          {result.success ? 'İçe Aktarma Başarılı' : 'İçe Aktarma Başarısız'}
        </AlertTitle>
        <AlertDescription className="text-sm">
          {result.message}
          <div className="mt-2">
            <p>Toplam İşlenen: {result.totalProcessed}</p>
            <p>Başarılı: {result.successCount}</p>
            <p>Hatalı: {result.errorCount}</p>
          </div>

          {result.errorCount > 0 && renderErrorDetails()}
        </AlertDescription>
      </Alert>
    );

  // Hata detayları
  const renderErrorDetails = () => (
    <div className="mt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowErrors(!showErrors)}
        className="text-xs"
      >
        {showErrors ? 'Hataları Gizle' : 'Hataları Göster'}
      </Button>

      {showErrors && (
        <div className="mt-2 max-h-40 overflow-y-auto text-xs bg-white p-2 rounded border border-red-200">
          <ul className="list-disc pl-4">
            {result?.errors.map((error, index) => (
              <li key={index} className="text-red-600 mb-1">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // Yardım kartı
  const renderHelpCard = () => (
    <Card>
      <CardHeader>
        <CardTitle>Yardım & İpuçları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-1">Şablon İndir</h3>
          <p className="text-xs text-gray-500 mb-2">
            Doğru format için örnek şablonu indirin ve kullanın.
          </p>
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Şablon İndir
          </Button>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-1">Önemli Notlar</h3>
          <ul className="text-xs text-gray-500 space-y-2">
            <li className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-1 flex-shrink-0 mt-0.5" />
              <span>
                Zorunlu alanların doldurulduğundan emin olun. Ürünler için isim ve fiyat zorunludur.
              </span>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-1 flex-shrink-0 mt-0.5" />
              <span>Büyük dosyaların işlenmesi zaman alabilir, lütfen bekleyin.</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-1 flex-shrink-0 mt-0.5" />
              <span>
                Mevcut verileri güncellemek için &quot;updateIfExists&quot; sütununu
                &quot;true&quot; olarak ayarlayın.
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-1">Veri Formatı</h3>
          <p className="text-xs text-gray-500">{importTypeDescriptions[activeTab]}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Toplu Veri İçe Aktarma</h1>

      <Tabs
        value={activeTab}
        onValueChange={value => setActiveTab(value as ImportType)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="products">Ürünler</TabsTrigger>
          <TabsTrigger value="categories">Kategoriler</TabsTrigger>
          <TabsTrigger value="brands">Markalar</TabsTrigger>
          <TabsTrigger value="variants">Varyantlar</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{importTypeLabels[activeTab]}</CardTitle>
              <CardDescription>
                Excel dosyasını yükleyerek toplu veri aktarımı yapabilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderFileUploadArea()}
              {renderUploadProgress()}
              {renderResultAlert()}
            </CardContent>
            <CardFooter>
              <p className="text-xs text-gray-500">Desteklenen dosya formatları: .xlsx, .xls</p>
            </CardFooter>
          </Card>

          {renderHelpCard()}
        </div>
      </Tabs>
    </div>
  );
}
