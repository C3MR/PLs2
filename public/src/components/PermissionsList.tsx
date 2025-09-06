import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { PERMISSION_CATEGORIES, type Permission } from '@/types/roles';


interface PermissionsListProps {
  selectedPermissions: Permission[];
  onPermissionChange?: (permission: Permission, checked: boolean) => void;
  readonly?: boolean;
  showCategories?: boolean;
}

const PermissionsList: React.FC<PermissionsListProps> = ({
  selectedPermissions,
  onPermissionChange,
  readonly = false,
  showCategories = true
}) => {
  const handlePermissionToggle = (permission: Permission, checked: boolean) => {
    if (!readonly && onPermissionChange) {
      onPermissionChange(permission, checked);
    }
  };

  if (!showCategories) {
    return (
      <div className="space-y-2">
        {selectedPermissions.map((permission) => (
          <Badge key={permission} variant="secondary" className="mr-2 mb-2">
            {permission}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(PERMISSION_CATEGORIES).map(([categoryKey, category]) => {
        const categoryPermissions = category.permissions;
        const hasAnyPermission = categoryPermissions.some(p => 
          selectedPermissions.includes(p)
        );

        if (readonly && !hasAnyPermission) return null;

        return (
          <Card key={categoryKey} className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <span className="text-lg">📁</span>
                {category.name}
                <Badge variant="outline" className="text-xs">
                  {categoryPermissions.filter(p => selectedPermissions.includes(p)).length}
                  {!readonly && `/${categoryPermissions.length}`}
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {category.description}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-2">
                {categoryPermissions.map((permission) => {
                  const isSelected = selectedPermissions.includes(permission);
                  
                  if (readonly && !isSelected) return null;

                  return (
                    <div key={permission} className="flex items-center space-x-2 rtl:space-x-reverse">
                      {!readonly && (
                        <Checkbox
                          id={permission}
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handlePermissionToggle(permission, !!checked)
                          }
                        />
                      )}
                      <label 
                        htmlFor={permission}
                        className={`text-sm flex-1 ${readonly ? '' : 'cursor-pointer'}`}
                      >
                        {permission}
                      </label>
                      {readonly && (
                        <Badge variant="default" className="text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PermissionsList;