import { useState } from 'react';
import { useLocation } from 'wouter';
import ProductForm from '@/components/forms/ProductForm';
import { useToast } from '@/hooks/use-toast';

export default function CreateProductPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Product created successfully!",
        description: `${data.name} has been added to your inventory.`,
      });
      
      setLocation('/products');
    } catch (error) {
      toast({
        title: "Error creating product",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocation('/products');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Product</h1>
        <p className="text-gray-600">Add a new wine product to your inventory</p>
      </div>
      
      <ProductForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
