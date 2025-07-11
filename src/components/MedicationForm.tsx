import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserStore } from '@/store/userStore';
import { useMedicationStore } from '@/store/medicationStore';
import { X, Plus } from 'lucide-react';
import { medicationSchema, type MedicationFormData } from '@/schema/schema';





interface MedicationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Partial<MedicationFormData>;
}

export function MedicationForm({ onSuccess, onCancel, initialData }: MedicationFormProps) {
  const { user } = useUserStore();
  const { addMedication, loading } = useMedicationStore();
  const [timeInput, setTimeInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: initialData || {
      name: '',
      dosage: '',
      frequency: 'daily',
      timeOfDay: ['09:00'],
    },
  });

  const frequency = watch('frequency');
  const timeOfDay = watch('timeOfDay');

  const handleAddTime = () => {
    if (timeInput.trim() && !timeOfDay.includes(timeInput.trim())) {
      setValue('timeOfDay', [...timeOfDay, timeInput.trim()]);
      setTimeInput('');
    }
  };

  const handleRemoveTime = (timeToRemove: string) => {
    setValue('timeOfDay', timeOfDay.filter(time => time !== timeToRemove));
  };

  const onSubmit = async (data: MedicationFormData) => {
    if (!user?.uid) return;

    try {
      await addMedication(data, user.uid);
      onSuccess();
    } catch (error) {
      console.error('Failed to add medication:', error);
    }
  };

  const getDefaultTimes = (freq: string) => {
    switch (freq) {
      case 'daily':
        return ['09:00'];
      case 'twice-daily':
        return ['09:00', '21:00'];
      case 'thrice-daily':
        return ['08:00', '14:00', '20:00'];
      case 'weekly':
        return ['09:00'];
      default:
        return [];
    }
  };

  const handleFrequencyChange = (newFrequency: string) => {
    setValue('frequency', newFrequency as any);
    if (newFrequency !== 'custom') {
      setValue('timeOfDay', getDefaultTimes(newFrequency));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" p-4 space-y-4">
      {/* Medication Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Medication Name</Label>
        <Input
          id="name"
          placeholder="e.g., Aspirin, Vitamin D"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Dosage */}
      <div className="space-y-2">
        <Label htmlFor="dosage">Dosage</Label>
        <Input
          id="dosage"
          placeholder="e.g., 100mg, 1 tablet"
          {...register('dosage')}
        />
        {errors.dosage && (
          <p className="text-sm text-red-500">{errors.dosage.message}</p>
        )}
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Select value={frequency} onValueChange={handleFrequencyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Once daily</SelectItem>
            <SelectItem value="twice-daily">Twice daily</SelectItem>
            <SelectItem value="thrice-daily">Three times daily</SelectItem>
            <SelectItem value="weekly">Once weekly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Time of Day */}
      <div className="space-y-2">
        <Label>Time of Day</Label>
        <div className="space-y-2">
          {frequency === 'custom' ? (
            <div className="flex gap-2">
              <Input
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                placeholder="HH:MM"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTime}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Default times will be set based on frequency
            </p>
          )}

          {/* Display selected times */}
          {timeOfDay.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {timeOfDay.map((time, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                >
                  <span className="text-sm">{time}</span>
                  {frequency === 'custom' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(time)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.timeOfDay && (
          <p className="text-sm text-red-500">{errors.timeOfDay.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Medication'}
        </Button>
      </div>
    </form>
  );
} 