"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { LuPlus as Plus, LuTrash2 as Trash2, LuPencil as Pencil, LuLayoutGrid as LayoutGrid, LuLoader as Loader2, LuSave as Save, LuX as X } from "react-icons/lu";
import { ConfirmationModal } from "@/components/admin/confirmation-modal";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/api/categories");
      setCategories(response.data.data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setIsEditing(category._id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setFormData({ name: "", slug: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      if (isEditing) {
        await apiClient.put(`/api/categories/${isEditing}`, formData);
        toast.success("Category updated successfully");
      } else {
        await apiClient.post("/api/categories", formData);
        toast.success("Category created successfully");
      }
      fetchCategories();
      handleCancel();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiClient.delete(`/api/categories/${deleteId}`);
      toast.success("Category deleted successfully");
      setCategories(categories.filter(c => c._id !== deleteId));
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product categories
          </p>
        </div>
        {!isAdding && !isEditing && (
          <Button 
            className="rounded-xl gap-2"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        )}
      </div>

      {(isAdding || isEditing) && (
        <Card className="border-border/50 mb-8 overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle>{isEditing ? "Edit Category" : "New Category"}</CardTitle>
            <CardDescription>
              {isEditing ? "Modify the categories details below." : "Enter the details for the new category."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        name,
                        slug: isEditing ? prev.slug : generateSlug(name)
                      }));
                    }}
                    required
                    placeholder="e.g. Roses"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug *</label>
                  <Input 
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                    placeholder="e.g. roses"
                    className="rounded-xl font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell us more about this category..."
                  className="rounded-xl min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  className="rounded-xl"
                  disabled={formLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="rounded-xl"
                  disabled={formLoading}
                >
                  {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {isEditing ? "Update Category" : "Create Category"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-shimmer h-40 rounded-xl bg-muted/20" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-muted/10 rounded-3xl border border-dashed border-border/60">
          <LayoutGrid className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
          <p className="font-serif font-semibold">No categories found</p>
          <p className="text-sm text-muted-foreground">
            Get started by creating your first category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category._id} className="border-border/50 hover:shadow-lg transition-all duration-300 group overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                      <LayoutGrid className="w-6 h-6" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(category._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-xs font-mono text-muted-foreground mb-3">{category.slug}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {category.description || "No description provided."}
                  </p>
                </div>
                <div className="px-6 py-4 bg-muted/30 border-t border-border/30 flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${category.isActive ? "text-green-600" : "text-amber-600"}`}>
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">ID: {category._id.slice(-6)}...</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmationModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone and may affect products in this category."
      />
    </div>
  );
}
