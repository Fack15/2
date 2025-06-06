import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Copy, Edit, Trash2, FileImage, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation, useRoute } from 'wouter';
import { mockProducts } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';

export default function ProductDetailPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/products/:id');
  const [product, setProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (match && params?.id) {
      const productId = parseInt(params.id);
      const foundProduct = mockProducts.find(p => p.id === productId);
      setProduct(foundProduct || null);
    }
  }, [match, params]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <Button 
            onClick={() => setLocation('/products')}
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Link has been copied to clipboard",
    });
  };

  const handleEdit = () => {
    toast({
      title: "Edit product",
      description: "Edit functionality would be implemented here",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Delete product",
      description: "Delete functionality would be implemented here",
      variant: "destructive",
    });
  };

  const handleDuplicate = () => {
    toast({
      title: "Duplicate product",
      description: "Product would be duplicated",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        onClick={() => setLocation('/products')}
        variant="ghost"
        className="mb-6 text-gray-600 hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to List
      </Button>
      
      {/* Product Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <p className="text-gray-600">{product.brand}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
                  alt={`${product.name} wine bottle`} 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Image Dimensions: 154x44, 206x156, 206x256, 300x117, 1000x750, 2000x1694</p>
            </CardContent>
          </Card>
          
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name:</label>
                  <p className="text-gray-900">{product.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand:</label>
                  <p className="text-gray-900">{product.brand || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Net Volume:</label>
                  <p className="text-gray-900">{product.netVolume || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vintage:</label>
                  <p className="text-gray-900">{product.vintage || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
                  <p className="text-gray-900">{product.type || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sugar Content:</label>
                  <p className="text-gray-900">{product.sugarContent || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appellation:</label>
                  <p className="text-gray-900">{product.appellation || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol Content:</label>
                  <p className="text-gray-900">{product.alcoholContent || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country:</label>
                  <p className="text-gray-900">{product.country || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU:</label>
                  <p className="text-gray-900">{product.sku || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">EAN:</label>
                  <p className="text-gray-900">{product.ean || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{product.ingredients || 'No ingredients specified'}</p>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Packaging Gases:</p>
                <p className="text-gray-600">{product.packagingGases || 'None specified'}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Nutrition Information */}
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portion Size:</label>
                  <p className="text-gray-900">{product.portionSize || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">kcal:</label>
                  <p className="text-gray-900">{product.kcal || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">kJ:</label>
                  <p className="text-gray-900">{product.kj || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fat:</label>
                  <p className="text-gray-900">{product.fat || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carbohydrates (g):</label>
                  <p className="text-gray-900">{product.carbohydrates || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {product.organic && <Badge variant="secondary" className="bg-green-100 text-green-800">Organic</Badge>}
                {product.vegetarian && <Badge variant="secondary" className="bg-green-100 text-green-800">Vegetarian</Badge>}
                {product.vegan && <Badge variant="secondary" className="bg-green-100 text-green-800">Vegan</Badge>}
                {!product.organic && !product.vegetarian && !product.vegan && (
                  <span className="text-gray-500">No certifications</span>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Food Business Operator */}
          <Card>
            <CardHeader>
              <CardTitle>Food Business Operator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
                  <p className="text-gray-900">{product.operatorType || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                  <p className="text-gray-900">{product.operatorName || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
                  <p className="text-gray-900">{product.operatorAddress || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information:</label>
                  <p className="text-gray-900">{product.operatorInfo || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Digital Assets and Actions */}
        <div className="space-y-6">
          {/* Digital Assets */}
          <Card>
            <CardHeader>
              <CardTitle>Digital Assets</CardTitle>
            </CardHeader>
            <CardContent>
              {/* QR Code */}
              <div className="text-center mb-6">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=https://localhost:1245/1/1" 
                  alt="QR Code for product information" 
                  className="w-32 h-32 mx-auto border rounded-lg" 
                />
                <p className="text-sm text-gray-600 mt-2">QR Code</p>
              </div>
              
              {/* Download Links */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Label Public Link:</label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value="https://localhost:1245/1/1" 
                      readOnly 
                      className="flex-1 text-sm bg-gray-50"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCopyLink("https://localhost:1245/1/1")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">External Short Link:</label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={product.externalShortLink || 'Not set'} 
                      readOnly 
                      className="flex-1 text-sm bg-gray-50"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCopyLink(product.externalShortLink || '')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Redirect Link:</label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={product.redirectLink || 'Not set'} 
                      readOnly 
                      className="flex-1 text-sm bg-gray-50"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCopyLink(product.redirectLink || '')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Audit Information */}
          <Card>
            <CardHeader>
              <CardTitle>Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Created on:</span>
                  <p className="text-gray-900">{product.createdAt?.toLocaleString() || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Created by:</span>
                  <p className="text-gray-900">Admin</p>
                </div>
                <div>
                  <span className="text-gray-600">Updated on:</span>
                  <p className="text-gray-900">{product.updatedAt?.toLocaleString() || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Updated by:</span>
                  <p className="text-gray-900">Admin</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="w-full">
                  <FileImage className="w-4 h-4 mr-2" />
                  Delete Image
                </Button>
                <Button variant="outline" className="w-full">
                  <FileImage className="w-4 h-4 mr-2" />
                  Change Image
                </Button>
                <Button variant="outline" className="w-full" onClick={handleDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
