import { useState, useRef } from 'react';
import { Plus, Upload, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import IngredientsTable from '@/components/tables/IngredientsTable';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Ingredient } from '@shared/schema';

export default function IngredientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ['/api/ingredients'],
    queryFn: async () => {
      const response = await fetch('/api/ingredients');
      if (!response.ok) throw new Error('Failed to fetch ingredients');
      return response.json() as Promise<Ingredient[]>;
    }
  });

  const deleteIngredientMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/ingredients/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ingredients'] });
      toast({
        title: "Ingredient deleted successfully",
        description: "The ingredient has been removed from your inventory.",
      });
    },
    onError: () => {
      toast({
        title: "Error deleting ingredient",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const duplicateIngredientMutation = useMutation({
    mutationFn: async (ingredient: Ingredient) => {
      const duplicateData = {
        name: `${ingredient.name} (Copy)`,
        category: ingredient.category,
        eNumber: ingredient.eNumber,
        allergens: ingredient.allergens,
        details: ingredient.details,
      };
      return apiRequest('/api/ingredients', { method: 'POST', data: duplicateData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ingredients'] });
      toast({
        title: "Ingredient duplicated successfully",
        description: "A copy has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Error duplicating ingredient",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingredient.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingredient.eNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (ingredient: Ingredient) => {
    setLocation(`/ingredients/${ingredient.id}/edit`);
  };

  const handleDelete = (ingredient: Ingredient) => {
    deleteIngredientMutation.mutate(ingredient.id);
  };

  const handleDuplicate = (ingredient: Ingredient) => {
    duplicateIngredientMutation.mutate(ingredient);
  };

  const handleImport = () => {
    toast({
      title: "Import ingredients",
      description: "Import functionality would be implemented here",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export ingredients",
      description: "Export functionality would be implemented here",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ingredients</h1>
        <p className="text-gray-600">Manage ingredients and allergen information</p>
      </div>
      
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => setLocation('/ingredients/create')}
            className="bg-accent hover:bg-accent/90 text-white font-medium"
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
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>
      
      {/* Ingredients Table */}
      <IngredientsTable 
        ingredients={filteredIngredients}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    </div>
  );
}
