import { Link } from 'react-router';
import { ChevronLeft, ChevronRight, Printer, Plus } from 'lucide-react';
import { weekAppointments } from '../data/demoData';

const days = [
  { label: 'Mon 5/18', date: '2026-05-18' },
  { label: 'Tue 5/19', date: '2026-05-19' },
  { label: 'Wed 5/20', date: '2026-05-20' },
  { label: 'Thu 5/21', date: '2026-05-21' },
  { label: 'Fri 5/22', date: '2026-05-22' },
  { label: 'Sat 5/23', date: '2026-05-23' },
  { label: 'Sun 5/24', date: '2026-05-24' },
];

const hours = Array.from({ length: 11 }, (_, i) => 8 + i); // 8am - 6pm

function slugFor(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export default function Scheduling() {
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white border-b border-[var(--ccg-border)] px-6 py-3 flex items-center gap-3">
        <h1 className="text-base font-semibold text-[var(--ccg-text)]">
          Week of May 18, 2026
        </h1>
        <div className="flex items-center gap-1 ml-2">
          <button className="p-1 rounded hover:bg-[var(--ccg-primary-soft)]">
            <ChevronLeft size={16} className="text-[var(--ccg-text-muted)]" />
          </button>
          <button className="px-2 py-0.5 text-xs border border-[var(--ccg-border)] rounded hover:bg-[var(--ccg-primary-soft)]">
            Today
          </button>
          <button className="p-1 rounded hover:bg-[var(--ccg-primary-soft)]">
            <ChevronRight size={16} className="text-[var(--ccg-text-muted)]" />
          </button>
        </div>
        <div className="text-xs text-[var(--ccg-text-muted)]">
          for <span className="text-[var(--ccg-primary)] font-medium">Dr. Emily Chen</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="text-xs text-[var(--ccg-text-muted)] flex items-center gap-1 hover:text-[var(--ccg-text)]">
            <Printer size={14} /> Print
          </button>
          <div className="flex border border-[var(--ccg-border)] rounded overflow-hidden text-xs">
            <button className="px-3 py-1 hover:bg-gray-50">Agenda</button>
            <button className="px-3 py-1 hover:bg-gray-50">Day</button>
            <button className="px-3 py-1 bg-[var(--ccg-primary)] text-white">Week</button>
            <button className="px-3 py-1 hover:bg-gray-50">Month</button>
          </div>
          <button className="flex items-center gap-1 bg-[var(--ccg-primary)] text-white text-xs font-medium px-2.5 py-1.5 rounded-md">
            <Plus size={12} /> New
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-[var(--ccg-border)] sticky top-0 bg-white z-10">
          <div className="border-r border-[var(--ccg-border)] bg-gray-50" />
          {days.map(d => {
            const isToday = d.date === '2026-05-22';
            return (
              <div
                key={d.date}
                className={`text-center py-2 text-xs font-medium border-r border-[var(--ccg-border)] ${
                  isToday
                    ? 'bg-[var(--ccg-primary-soft)] text-[var(--ccg-primary)]'
                    : 'text-[var(--ccg-text-muted)]'
                }`}
              >
                {d.label}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-[60px_repeat(7,1fr)] relative">
          {hours.map(hour => (
            <Row key={hour} hour={hour} />
          ))}

          {/* Render appointments overlaid */}
          {weekAppointments.map(appt => {
            const dayIdx = days.findIndex(d => appt.start.startsWith(d.date));
            if (dayIdx === -1) return null;
            const date = new Date(appt.start);
            const startHour = date.getHours() + date.getMinutes() / 60;
            const top = (startHour - 8) * 56; // 56px per hour
            const height = (appt.durationMin / 60) * 56;
            const left = `calc(60px + ${dayIdx} * ((100% - 60px) / 7) + 2px)`;
            const width = `calc((100% - 60px) / 7 - 4px)`;
            const isCompleted = appt.status === 'Completed';
            const isPending = appt.status === 'Scheduled' || appt.status === 'Confirmed';
            return (
              <Link
                key={appt.id}
                to={`/patients/${slugFor(appt.patientName)}`}
                className={`absolute rounded-md border-l-4 px-2 py-1 text-[10px] overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                  isCompleted
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : isPending
                      ? 'bg-[var(--ccg-primary-soft)] border-[var(--ccg-primary)] text-[var(--ccg-primary)]'
                      : 'bg-red-50 border-red-500 text-red-900'
                }`}
                style={{ top, left, width, height }}
              >
                <div className="font-semibold truncate">{appt.patientName}</div>
                <div className="truncate opacity-80">
                  {date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}{' '}
                  · {appt.type}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Row({ hour }: { hour: number }) {
  const label =
    hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  return (
    <>
      <div className="h-14 border-r border-b border-[var(--ccg-border)] text-[10px] text-[var(--ccg-text-muted)] px-2 pt-1 bg-gray-50">
        {label}
      </div>
      {days.map(d => (
        <div
          key={`${d.date}-${hour}`}
          className="h-14 border-r border-b border-[var(--ccg-border)]"
        />
      ))}
    </>
  );
}
