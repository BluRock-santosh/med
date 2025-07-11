import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/userStore';
import { useMedicationStore } from '@/store/medicationStore';
import type { Medication } from '@/types/medication';
import type { UserRole } from '@/types/user';
import { CheckCircle, Clock, Trash2, Edit } from 'lucide-react';

interface MedicationListProps {
  medications: Medication[];
  onMedicationUpdated: () => void;
  userRole: UserRole;
}

export function MedicationList({ medications, onMedicationUpdated, userRole }: MedicationListProps) {
  const { user } = useUserStore();
  const { markAsTaken, checkTakenToday, deleteMedication } = useMedicationStore();
  const [takenStatus, setTakenStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check taken status for all medications
    const checkAllTakenStatus = async () => {
      if (!user?.uid) return;

      const status: Record<string, boolean> = {};
      for (const medication of medications) {
        status[medication.id] = await checkTakenToday(medication.id, user.uid);
      }
      setTakenStatus(status);
    };

    checkAllTakenStatus();
  }, [medications, user?.uid]);

  const handleMarkAsTaken = async (medicationId: string) => {
    if (!user?.uid) return;

    try {
      await markAsTaken(medicationId, user.uid);
      setTakenStatus(prev => ({ ...prev, [medicationId]: true }));
      onMedicationUpdated();
    } catch (error) {
      console.error('Failed to mark medication as taken:', error);
    }
  };

  const handleDeleteMedication = async (medicationId: string) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      try {
        await deleteMedication(medicationId);
        onMedicationUpdated();
      } catch (error) {
        console.error('Failed to delete medication:', error);
      }
    }
  };

  const formatTime = (time: string) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'twice-daily':
        return 'Twice Daily';
      case 'thrice-daily':
        return 'Three Times Daily';
      case 'weekly':
        return 'Weekly';
      case 'custom':
        return 'Custom';
      default:
        return frequency;
    }
  };

  const getStatusColor = (medicationId: string) => {
    return takenStatus[medicationId] ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusIcon = (medicationId: string) => {
    return takenStatus[medicationId] ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <Clock className="w-4 h-4 text-yellow-600" />
    );
  };

  if (medications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No medications found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {medications.map((medication) => (
        <Card key={medication.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{medication.name}</h3>
                  <Badge variant="secondary" className={getStatusColor(medication.id)}>
                    {getStatusIcon(medication.id)}
                    <span className="ml-1">
                      {takenStatus[medication.id] ? 'Taken' : 'Pending'}
                    </span>
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><strong>Dosage:</strong> {medication.dosage}</p>
                  <p><strong>Frequency:</strong> {getFrequencyLabel(medication.frequency)}</p>
                  <p><strong>Times:</strong> {medication.timeOfDay.map(formatTime).join(', ')}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {/* Patient can mark as taken */}
                  {userRole === 'patient' && !takenStatus[medication.id] && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsTaken(medication.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark as Taken
                    </Button>
                  )}
                  
                  {/* Caretaker can edit and delete */}
                  {userRole === 'caretaker' && (
                    <>
                      

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteMedication(medication.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 