"use client";

import { useState } from "react";
import { Bed, BedStatus } from "@prisma/client";
import { AddBedStatusModal } from "./add-bed-status-modal";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import {calculateOffset, calculatePercentage, date2Time} from "@/lib/utils";

interface BedsGridProps {
  beds: (Bed & { statuses: BedStatus[] })[];
  noBeds: string;
  scheduleStart: Date;
  scheduleEnd: Date;
}

export function BedsGrid(props: BedsGridProps) {
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
    const classNames = ["bed-statuses"];
    if (bed.statuses.length === 0 || !bed.statuses.some(status => status.startDate <= now && status.endDate > now)) {
      classNames.push("bed-statuses-available");
    }
    return (
      <div className={classNames.join(" ")}>
        {bed.statuses.map((status, statusIdx) => (
          <div key={`${bedIdx}-${statusIdx}`}
            className="bed-status"
            style={{
              left: calculateOffset(status.startDate, props.scheduleStart, props.scheduleEnd)+'%',
              width: calculatePercentage(status.startDate, status.endDate, props.scheduleStart, props.scheduleEnd) + "%"
            }}
          >
            <div className="status-time-start">{date2Time(status.startDate)}</div>
            <div className="status">{status.status}</div>
            <div className="status-time-end">{date2Time(status.endDate)}</div>
          </div>
        ))}
        <div className="time-now-line" style={{
          left: calculateOffset(now, props.scheduleStart, props.scheduleEnd) + '%'
        }}/>
      </div>
    );
  };

  const renderBed = (bed: Bed & { statuses: BedStatus[] }, bedIdx: number) => {
    return (
      <Fragment key={bedIdx}>
        <div className="bed-name" data-test-id="bed-name">
          <Button
            size="sm"
            variant="outline"
            className="bed-add-button"
            onClick={() => handleAddClick(bed.id)}
          >
            Add
          </Button>
          <span>{bed.name}</span>
        </div>
        {renderStatuses(bed, bedIdx)}
      </Fragment>
    );
  };

  const renderGrid = (beds: (Bed & { statuses: BedStatus[] })[]) => (
      <>
        <div data-testid="time-row" className="time-row">
          <div className="time-labels">Today</div>
          <div className="timeline">

          </div>
        </div>
        <div data-testid="bed-grid" className="beds-grid overflow-x-auto">
          {beds.map((bed, bedIdx) => renderBed(bed, bedIdx))}
        </div>
      </>
  );

  return (
    <>
      {props.beds.length > 0 ? renderGrid(props.beds) : <div>{props.noBeds}</div>}
      <AddBedStatusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        beds={props.beds}
        selectedBedId={selectedBedId}
      />
    </>
  );
} 