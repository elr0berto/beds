"use client";

import { useState } from "react";
import { Bed, BedStatus } from "@prisma/client";
import { AddBedStatusModal } from "./add-bed-status-modal";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";

interface BedsGridProps {
  beds: (Bed & { statuses: BedStatus[] })[];
  noBeds: string;
}

export function BedsGrid({ beds, noBeds }: BedsGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBedId, setSelectedBedId] = useState<number | undefined>(undefined);

  const handleAddClick = (bedId: number) => {
    setSelectedBedId(bedId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBedId(undefined);
  };

  const renderStatuses = (bed: Bed & { statuses: BedStatus[] }, bedIdx: number) => {
    const now = new Date();
    let classNames = ["bed-statuses"];
    if (bed.statuses.length === 0 || !bed.statuses.some(status => status.startDate <= now && status.endDate > now)) {
      classNames.push("bed-statuses-available");
    }
    return (
      <div className={classNames.join(" ")}>
        {bed.statuses.map((status, statusIdx) => (
          <div key={`${bedIdx}-${statusIdx}`} className="bed-status">{status.status}</div>
        ))}
      </div>
    );
  };

  const renderBed = (bed: Bed & { statuses: BedStatus[] }, bedIdx: number) => {
    return (
      <Fragment key={bedIdx}>
        <div className="bed-name">
          <span>{bed.name}</span>
          <Button
            size="sm"
            variant="outline"
            className="bed-add-button"
            onClick={() => handleAddClick(bed.id)}
          >
            Add
          </Button>
        </div>
        {renderStatuses(bed, bedIdx)}
      </Fragment>
    );
  };

  const renderGrid = (beds: (Bed & { statuses: BedStatus[] })[]) => (
    <div data-testid="bed-grid" className="beds-grid overflow-x-auto">
      {beds.map((bed, bedIdx) => renderBed(bed, bedIdx))}
    </div>
  );

  return (
    <>
      {beds.length > 0 ? renderGrid(beds) : <div>{noBeds}</div>}
      <AddBedStatusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        beds={beds}
        selectedBedId={selectedBedId}
      />
    </>
  );
} 