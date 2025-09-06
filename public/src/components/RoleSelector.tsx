import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ROLES, type AppRole } from '@/types/roles';

interface RoleSelectorProps {
  value?: AppRole;
  onValueChange: (role: AppRole) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  showBadge?: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = "اختر الدور",
  className,
  showBadge = true
}) => {
  const selectedRoleInfo = value ? ROLES[value] : null;

  return (
    <div className="space-y-2">
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ROLES).map((roleInfo) => (
            <SelectItem key={roleInfo.role} value={roleInfo.role}>
              <div className="flex items-center gap-2">
                <div 
                  className={`w-3 h-3 rounded-full ${roleInfo.color}`}
                />
                <span>{roleInfo.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({roleInfo.description})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {showBadge && selectedRoleInfo && (
        <Badge 
          variant="secondary" 
          className={`${selectedRoleInfo.color} text-white`}
        >
          {selectedRoleInfo.name}
        </Badge>
      )}
    </div>
  );
};

export default RoleSelector;