import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail,
  Send,
  Search,
  Filter,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Paperclip,
  Phone,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Plus,
  MoreVertical
} from 'lucide-react';

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data للرسائل
  const messages = [
    {
      id: 'MSG-001',
      from: 'أحمد محمد السالم',
      fromEmail: 'ahmed@example.com',
      subject: 'استفسار عن فيلا في حي العليا',
      preview: 'مرحباً، أود الاستفسار عن الفيلا المعروضة في حي العليا...',
      content: 'مرحباً،\n\nأود الاستفسار عن الفيلا المعروضة في حي العليا بمساحة 450 متر مربع. هل يمكن ترتيب موعد للمعاينة؟\n\nشكراً لكم',
      timestamp: '2024-03-20 10:30',
      isRead: false,
      isStarred: true,
      priority: 'high',
      propertyRef: 'PROP-001',
      attachments: []
    },
    {
      id: 'MSG-002',
      from: 'فاطمة علي الأحمد',
      fromEmail: 'fatima@example.com',
      subject: 'طلب تقييم عقار',
      preview: 'السلام عليكم، أرغب في تقييم شقتي في الملقا...',
      content: 'السلام عليكم ورحمة الله وبركاته،\n\nأرغب في تقييم شقتي في حي الملقا لبيعها. هل يمكن تحديد موعد للمعاينة والتقييم؟\n\nمع التقدير',
      timestamp: '2024-03-20 09:15',
      isRead: true,
      isStarred: false,
      priority: 'medium',
      propertyRef: null,
      attachments: ['صور_الشقة.zip']
    },
    {
      id: 'MSG-003',
      from: 'خالد عبدالله النصر',
      fromEmail: 'khalid@example.com',
      subject: 'تأكيد موعد المعاينة',
      preview: 'شكراً لكم على تحديد الموعد، أؤكد حضوري غداً...',
      content: 'شكراً لكم على تحديد موعد المعاينة.\n\nأؤكد حضوري غداً الساعة 11:30 صباحاً لمعاينة الأرض التجارية في حي الورود.\n\nأرجو التأكيد',
      timestamp: '2024-03-19 16:45',
      isRead: true,
      isStarred: false,
      priority: 'low',
      propertyRef: 'PROP-003',
      attachments: []
    },
    {
      id: 'MSG-004',
      from: 'نورا سعد الغامدي',
      fromEmail: 'nora@example.com',
      subject: 'شكوى حول الخدمة',
      preview: 'أود تقديم شكوى حول تأخير الرد على استفساري...',
      content: 'السلام عليكم،\n\nأود تقديم شكوى حول تأخير الرد على استفساري المرسل الأسبوع الماضي. أرجو المتابعة السريعة.\n\nشكراً',
      timestamp: '2024-03-19 14:20',
      isRead: false,
      isStarred: false,
      priority: 'high',
      propertyRef: null,
      attachments: []
    }
  ];

  const messageStats = {
    unread: messages.filter(m => !m.isRead).length,
    starred: messages.filter(m => m.isStarred).length,
    high_priority: messages.filter(m => m.priority === 'high').length,
    with_attachments: messages.filter(m => m.attachments.length > 0).length
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">عالي</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-orange-100 text-orange-800 text-xs">متوسط</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">منخفض</Badge>;
      default:
        return null;
    }
  };

  const filteredMessages = messages.filter(message =>
    message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendReply = () => {
    if (replyText.trim()) {
      // Mock send reply
      setReplyText('');
      // Show success toast or notification
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-right">الرسائل</h1>
          <p className="text-muted-foreground">إدارة المراسلات مع العملاء والمهتمين</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            تصفية
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            رسالة جديدة
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-red-800">{messageStats.unread}</p>
            <p className="text-sm text-red-600">غير مقروءة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-yellow-800">{messageStats.starred}</p>
            <p className="text-sm text-yellow-600">مميزة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-orange-800">{messageStats.high_priority}</p>
            <p className="text-sm text-orange-600">أولوية عالية</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <Paperclip className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-800">{messageStats.with_attachments}</p>
            <p className="text-sm text-blue-600">مع مرفقات</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">صندوق الرسائل</CardTitle>
                <Badge variant="secondary">{filteredMessages.length}</Badge>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الرسائل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                      !message.isRead ? 'bg-blue-50/50' : ''
                    } ${selectedMessage?.id === message.id ? 'bg-primary/10' : ''}`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {message.from.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${!message.isRead ? 'font-bold' : 'font-medium'}`}>
                            {message.from}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {message.subject}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {message.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        {!message.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {message.preview}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(message.priority)}
                        {message.attachments.length > 0 && (
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {selectedMessage.from.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedMessage.from}</h3>
                      <p className="text-sm text-muted-foreground">{selectedMessage.fromEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Star className={`h-4 w-4 ${selectedMessage.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{selectedMessage.timestamp}</span>
                    </div>
                    {selectedMessage.propertyRef && (
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {selectedMessage.propertyRef}
                        </Badge>
                      </div>
                    )}
                    {getPriorityBadge(selectedMessage.priority)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Message Content */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedMessage.content}
                  </pre>
                </div>

                {/* Attachments */}
                {selectedMessage.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">المرفقات</h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{attachment}</span>
                          <Button variant="ghost" size="sm" className="mr-auto">
                            تحميل
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button className="gap-2">
                    <Reply className="h-4 w-4" />
                    رد
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Forward className="h-4 w-4" />
                    إعادة توجيه
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Phone className="h-4 w-4" />
                    اتصال
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Video className="h-4 w-4" />
                    فيديو
                  </Button>
                </div>

                {/* Reply Box */}
                <div className="space-y-3 border-t pt-6">
                  <h4 className="font-medium">الرد السريع</h4>
                  <Textarea
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={handleSendReply} disabled={!replyText.trim()} className="gap-2">
                      <Send className="h-4 w-4" />
                      إرسال
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">اختر رسالة لعرضها</h3>
                  <p className="text-muted-foreground">
                    انقر على أي رسالة من القائمة لعرض تفاصيلها والرد عليها
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;