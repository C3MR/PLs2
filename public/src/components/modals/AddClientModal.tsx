import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

const AddClientModal = ({ isOpen, onClose, onClientAdded }: AddClientModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'individual',
    status: 'potential',
    notes: '',
    preferredAreas: [] as string[]
  });
  const [newArea, setNewArea] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('clients')
        .insert({
          client_id: '', // سيتم إنشاؤه تلقائياً بواسطة trigger
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          type: formData.type,
          status: formData.status,
          notes: formData.notes,
          preferred_areas: formData.preferredAreas,
          created_by: (await supabase.auth.getUser()).data.user?.id || null
        });

      if (error) throw error;

      toast({
        title: "تم إضافة العميل بنجاح",
        description: "تم إضافة العميل الجديد إلى قاعدة البيانات",
      });

      onClientAdded();
      onClose();
      setFormData({
        name: '',
        phone: '',
        email: '',
        type: 'individual',
        status: 'potential',
        notes: '',
        preferredAreas: []
      });
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "خطأ في إضافة العميل",
        description: "حدث خطأ أثناء إضافة العميل. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addPreferredArea = () => {
    if (newArea.trim() && !formData.preferredAreas.includes(newArea.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredAreas: [...prev.preferredAreas, newArea.trim()]
      }));
      setNewArea('');
    }
  };

  const removePreferredArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      preferredAreas: prev.preferredAreas.filter(a => a !== area)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">إضافة عميل جديد</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">اسم العميل *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="أدخل اسم العميل"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">رقم الجوال *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="05xxxxxxxx"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">نوع العميل</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">فرد</SelectItem>
                  <SelectItem value="company">شركة</SelectItem>
                  <SelectItem value="investor">مستثمر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">حالة العميل</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="potential">محتمل</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">الأحياء المفضلة</Label>
            <div className="flex gap-2">
              <Input
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="أضف حي مفضل"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredArea())}
              />
              <Button type="button" onClick={addPreferredArea} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.preferredAreas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.preferredAreas.map((area, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {area}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removePreferredArea(area)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">ملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="أضف أي ملاحظات حول العميل..."
              rows={3}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الإضافة...' : 'إضافة العميل'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;