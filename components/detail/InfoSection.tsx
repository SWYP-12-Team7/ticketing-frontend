"use client";

import { cn } from "@/lib/utils";

interface OperatingHour {
  day: string;
  time: string;
}

interface InfoSectionProps {
  className?: string;
  id?: string;
  period: string;
  operatingHours: OperatingHour[];
  closedDays?: string;
  contact?: string;
}

export function InfoSection({
  className,
  id,
  period,
  operatingHours,
  closedDays,
  contact,
}: InfoSectionProps) {
  return (
    <section className={cn("border-t border-border py-10", className)} id={id}>
      <div className="mx-auto max-w-300 px-5">
         <h2 className="mb-6 text-heading-medium">이용안내</h2> 

        <div className="space-y-4">
          {/* 기간 */}
          <div className="flex gap-6">
            <span className="w-16 shrink-0 text-body-medium-bold">
              기간
            </span>
            <span className="text-body-medium">{period}</span>
          </div>

          {/* 운영시간 */}
          <div className="flex gap-6">
            <span className="w-16 shrink-0 text-body-medium-bold">
              시간
            </span>
            <div className="space-y-1">
              {operatingHours.map((hour, index) => (
                <div key={index} className="flex gap-2 text-body-medium">
                  <span className="w-6">{hour.day}</span>
                  <span>{hour.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 휴무일 */}
          {closedDays && (
            <div className="flex gap-6">
              <span className="w-16 shrink-0 text-body-medium-bold">
                휴무
              </span>
              <span className="text-body-medium">{closedDays}</span>
            </div>
          )}

          {/* 문의 */}
          {contact && (
            <div className="flex gap-6">
              <span className="w-16 shrink-0 text-body-medium-bold">
                문의
              </span>
              <span className="text-body-medium">{contact}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
