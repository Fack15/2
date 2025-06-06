import { useState } from 'react';
import { useLocation } from 'wouter';
import IngredientForm from '@/components/forms/IngredientForm';
import { useToast } from '@/hooks/use-toast';

export default function CreateIngredientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Ingredient created successfully!",
        description: `${data.name} has been added to your ingredients database.`,
      });
      
      setLocation('/ingredients');
    } catch (error) {
      toast({
        title: "Error creating ingredient",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocation('/ingredients');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Ingredient</h1>
        <p className="text-gray-600">Add a new ingredient to your database</p>
      </div>
      
      <IngredientForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}
