import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';
import type { UserRole } from '@/types/user';
import { User, Heart, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function RoleSwitcher() {
  const { user, updateUserRole, isPatient, isCaretaker } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole === user?.role) return;
    
    setLoading(true);
    try {
      updateUserRole(newRole);
      // You could also save the role change to Firebase here
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    return role === 'patient' ? <Heart className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  const getRoleLabel = (role: UserRole) => {
    return role === 'patient' ? 'Patient' : 'Caretaker';
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          <Settings className="w-4 h-4 mr-2" />
          {getRoleIcon(user.role)}
          <span className="ml-2">{getRoleLabel(user.role)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleRoleChange('patient')}
          disabled={isPatient()}
        >
          <Heart className="w-4 h-4 mr-2" />
          Patient
          {isPatient() && <span className="ml-2 text-xs text-muted-foreground">(Current)</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleRoleChange('caretaker')}
          disabled={isCaretaker()}
        >
          <User className="w-4 h-4 mr-2" />
          Caretaker
          {isCaretaker() && <span className="ml-2 text-xs text-muted-foreground">(Current)</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 