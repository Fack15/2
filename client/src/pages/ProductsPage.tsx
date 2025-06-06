import { useState } from 'react';
import { Plus, Upload, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductsTable from '@/components/tables/ProductsTable';
import { mockProducts } from '@/lib/mock-data';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products] = useState<Product[]>(mockProducts);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    // Navigate to edit page (would be implemented with product ID)
    toast({
      title: "Edit product",
      description: `Editing ${product.name}`,
    });
  };

  const handleDelete = (product: Product) => {
    toast({
      title: "Delete product",
      description: `${product.name} would be deleted`,
      variant: "destructive",
    });
  };

  const handleDuplicate = (product: Product) => {
    toast({
      title: "Duplicate product",
      description: `${product.name} would be duplicated`,
    });
  };

  const handleImport = () => {
    toast({
      title: "Import products",
      description: "Import functionality would be implemented here",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export products",
      description: "Export functionality would be implemented here",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">Manage your product inventory and details</p>
      </div>
      
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => setLocation('/products/create')}
            className="bg-primary hover:bg-primary/90 text-white font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
          <Button variant="outline" onClick={handleImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>
      
      {/* Products Table */}
      <ProductsTable 
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    </div>
  );
}
