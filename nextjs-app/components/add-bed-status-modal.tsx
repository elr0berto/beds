"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBedStatus } from "@/app/actions";
import { Bed } from "@prisma/client";

interface AddBedStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  beds: Bed[];
  selectedBedId?: number;
}

export function AddBedStatusModal({ isOpen, onClose, beds, selectedBedId }: AddBedStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const durationOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 30);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      // Convert time input to full datetime
      const timeValue = formData.get("time") as string;
      const today = new Date();
      const [hours, minutes] = timeValue.split(':').map(Number);
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
      
      // Replace time with full datetime
      formData.set("startDate", startDate.toISOString());
      formData.delete("time");

      await createBedStatus(formData);
      onClose();
    } catch (error) {
      console.error("Error creating bed status:", error);
      alert("Failed to create bed status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Add Bed Status</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bedId">Bed</Label>
              <select
                id="bedId"
                name="bedId"
                defaultValue={selectedBedId}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {beds.map((bed) => (
                  <option key={bed.id} value={bed.id}>
                    {bed.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="time">Start Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                defaultValue={getCurrentTime()}
                className="w-full mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <select
                id="duration"
                name="duration"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {durationOptions.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} minutes
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                name="status"
                type="text"
                placeholder="Enter status..."
                className="w-full mt-1"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 