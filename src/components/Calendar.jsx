import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const Calendar = ({ jobs, onDateSelect, selectedDate, onClearDate, onJobClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getJobsForDate = (date) => {
    return jobs.filter(job => isSameDay(new Date(job.applicationDate), date));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-accent rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-accent rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}

        {days.map((day, dayIdx) => {
          const jobsForDay = getJobsForDate(day);
          const hasJobs = jobsForDay.length > 0;
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toString()}
              className={`
                relative p-2 h-24 border rounded-md text-left cursor-pointer
                ${isCurrentMonth ? 'bg-background' : 'bg-muted/50'}
                ${hasJobs ? 'border-primary hover:border-primary/80' : 'border-border'}
                ${isSelected ? 'ring-2 ring-primary' : ''}
                hover:bg-accent/5 transition-all duration-200 ease-in-out
                group
              `}
              onClick={() => hasJobs && onDateSelect(day)}
            >
              <div className="text-sm font-medium">
                {format(day, 'd')}
              </div>
              {hasJobs && (
                <div className="mt-1">
                  <div className="text-xs text-primary font-medium">
                    {jobsForDay.length} {jobsForDay.length === 1 ? 'application' : 'applications'}
                  </div>
                </div>
              )}
              {hasJobs && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 rounded-md">
                  <div className="text-white text-center p-2 transform scale-95 group-hover:scale-100 transition-transform duration-200">
                    <div className="space-y-1.5">
                      {jobsForDay.map(job => (
                        <button
                          key={job._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onJobClick(job);
                          }}
                          className="block w-full text-left text-xs font-medium hover:text-blue-200 transition-colors"
                        >
                          {job.company}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar; 