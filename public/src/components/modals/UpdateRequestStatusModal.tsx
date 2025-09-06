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

interface UpdateRequestStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: () => void;
  requestId: string;
  currentStatus: string;
  requestTitle: string;
}

const UpdateRequestStatusModal = ({ 
  isOpen, 
  onClose, 
  onStatusUpdated, 
  requestId, 
  currentStatus, 
  requestTitle 
}: UpdateRequestStatusModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates: any = { status };
      if (assignedTo.trim()) updates.assigned_to = assignedTo.trim();
      if (notes.trim()) updates.notes = notes.trim();

      const { error } = await supabase
        .from('property_requests')
        .update(updates)
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "تم تحديث الطلب بنجاح",
        description: "تم تحديث حالة الطلب والتفاصيل",
      });

      onStatusUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "خطأ في تحديث الطلب",
        description: "حدث خطأ أثناء تحديث الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'معلق';
      case 'in_progress': return 'قيد المعالجة';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return 'غير محدد';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>تحديث حالة الطلب</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">{requestTitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>الحالة الحالية</Label>
            <Badge className={getStatusColor(currentStatus)}>
              {getStatusLabel(currentStatus)}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">الحالة الجديدة *</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">تعيين المسؤول</Label>
            <Input
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="اسم الموظف المسؤول"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات التحديث</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أضف ملاحظات حول التحديث..."
              rows={3}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري التحديث...' : 'تحديث الطلب'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRequestStatusModal;