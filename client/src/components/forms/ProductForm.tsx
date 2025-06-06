import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { wineTypeOptions, operatorTypeOptions } from '@/lib/mock-data';
import type { Product } from '@shared/schema';

const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  brand: z.string().optional(),
  netVolume: z.string().optional(),
  vintage: z.string().optional(),
  type: z.string().optional(),
  sugarContent: z.string().optional(),
  appellation: z.string().optional(),
  alcoholContent: z.string().optional(),
  country: z.string().optional(),
  sku: z.string().optional(),
  ean: z.string().optional(),
  ingredients: z.string().optional(),
  packagingGases: z.string().optional(),
  portionSize: z.string().optional(),
  kcal: z.string().optional(),
  kj: z.string().optional(),
  fat: z.string().optional(),
  carbohydrates: z.string().optional(),
  organic: z.boolean().default(false),
  vegetarian: z.boolean().default(false),
  vegan: z.boolean().default(false),
  operatorType: z.string().optional(),
  operatorName: z.string().optional(),
  operatorAddress: z.string().optional(),
  operatorInfo: z.string().optional(),
  externalShortLink: z.string().optional(),
  redirectLink: z.string().optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? {
      name: product.name,
      brand: product.brand || '',
      netVolume: product.netVolume || '',
      vintage: product.vintage || '',
      type: product.type || '',
      sugarContent: product.sugarContent || '',
      appellation: product.appellation || '',
      alcoholContent: product.alcoholContent || '',
      country: product.country || '',
      sku: product.sku || '',
      ean: product.ean || '',
      ingredients: product.ingredients || '',
      packagingGases: product.packagingGases || '',
      portionSize: product.portionSize || '',
      kcal: product.kcal || '',
      kj: product.kj || '',
      fat: product.fat || '',
      carbohydrates: product.carbohydrates || '',
      organic: product.organic || false,
      vegetarian: product.vegetarian || false,
      vegan: product.vegan || false,
      operatorType: product.operatorType || '',
      operatorName: product.operatorName || '',
      operatorAddress: product.operatorAddress || '',
      operatorInfo: product.operatorInfo || '',
      externalShortLink: product.externalShortLink || '',
      redirectLink: product.redirectLink || '',
    } : {
      name: '',
      brand: '',
      netVolume: '',
      vintage: '',
      type: '',
      sugarContent: '',
      appellation: '',
      alcoholContent: '',
      country: '',
      sku: '',
      ean: '',
      ingredients: '',
      packagingGases: '',
      portionSize: '',
      kcal: '',
      kj: '',
      fat: '',
      carbohydrates: '',
      organic: false,
      vegetarian: false,
      vegan: false,
      operatorType: '',
      operatorName: '',
      operatorAddress: '',
      operatorInfo: '',
      externalShortLink: '',
      redirectLink: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="netVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Net Volume</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 750ml" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Wine Details */}
        <Card>
          <CardHeader>
            <CardTitle>Wine Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="vintage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vintage</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 2019" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wine Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select wine type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wineTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sugarContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sugar Content</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Dry, Brut" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appellation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appellation</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Bordeaux AOC" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alcoholContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alcohol Content</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 13.5%" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. France" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients List</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="List all ingredients..." className="h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="packagingGases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Packaging Gases</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="List packaging gases used..." className="h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Nutrition Information */}
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="portionSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portion Size</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 100ml" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kcal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>kcal</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 83" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>kJ</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 347" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fat (g)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="carbohydrates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carbohydrates (g)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 2.6" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="organic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Organic
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vegetarian"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Vegetarian
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vegan"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Vegan
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Food Business Operator */}
        <Card>
          <CardHeader>
            <CardTitle>Food Business Operator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="operatorType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {operatorTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operatorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operatorAddress"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="h-20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operatorInfo"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="h-20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logistics */}
        <Card>
          <CardHeader>
            <CardTitle>Logistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ean"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EAN</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="13-digit EAN code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Portability */}
        <Card>
          <CardHeader>
            <CardTitle>Portability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="externalShortLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Short Link</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://short.ly/product" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="redirectLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect Link</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://redirect.com/product" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
