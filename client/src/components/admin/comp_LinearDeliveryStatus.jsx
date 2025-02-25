import React from 'react';
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, CircleEllipsis, Clock, AlertCircle } from 'lucide-react';

function DeliveryStatus({ currentStatus, deliveries, statusOrder=["Reviewing", "In Queue", "Printing", "Completed", "Shipping", "Delivered"] }) {
  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto text-white">
      {deliveries.map((delivery, index) => {
        const currentStepIndex = statusOrder.indexOf(delivery.status)
        
        // Get status icon
        const getStatusIcon = (stepIndex, currentIndex) => {
          if (stepIndex === currentIndex) {
            return <CircleEllipsis className="h-4 w-4 text-cyan-300" />;
          } else if (stepIndex < currentIndex) {
            return <CheckCircle className="h-4 w-4 text-emerald-300" />;
          } else {
            return <Clock className="h-4 w-4 text-gray-500" />;
          }
        };
        
        return (
          <div key={index} className="relative">
            <div className="flex items-center">
              {statusOrder.map((step, stepIndex) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className={cn(
                    "flex flex-col items-center relative flex-1",
                    stepIndex === 0 ? "items-start" : stepIndex === statusOrder.length - 1 ? "items-end" : "items-center"
                  )}>
                    {stepIndex === currentStepIndex ? (
                      <Badge
                        className={cn(
                          "absolute top-1/2 transform -translate-y-1/2",
                          stepIndex === 0 ? "left-0" : stepIndex === statusOrder.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2",
                          "h-10 rounded-full border flex items-center justify-center text-sm font-medium px-4 z-10 whitespace-nowrap",
                          "bg-gradient-to-r from-cyan-900/70 to-cyan-800/40 border-cyan-700/40 text-cyan-300 shadow-md"
                        )}
                      >
                        <CircleEllipsis className="h-4 w-4 mr-1.5" />
                        {step}
                      </Badge>
                    ) : (
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full border flex items-center justify-center z-10",
                          stepIndex < currentStepIndex
                            ? "border-emerald-700/40 bg-emerald-900/20"
                            : "border-neutral-700/50 bg-[#2A2A2A]/40"
                        )}
                      >
                        {getStatusIcon(stepIndex, currentStepIndex)}
                      </div>
                    )}
                    {stepIndex !== currentStepIndex && (
                      <span className={cn(
                        "absolute top-10 transform whitespace-nowrap text-xs font-medium",
                        stepIndex === 0 ? "left-0" : stepIndex === statusOrder.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2",
                        stepIndex < currentStepIndex ? "text-emerald-300/80" : "text-gray-500"
                      )}>
                        {step}
                      </span>
                    )}
                  </div>
                  {stepIndex < statusOrder.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 w-full",
                        stepIndex < currentStepIndex 
                          ? "bg-gradient-to-r from-emerald-600/70 to-emerald-600/40" 
                          : stepIndex === currentStepIndex
                            ? "bg-gradient-to-r from-cyan-600/70 to-neutral-700/30"
                            : "bg-neutral-700/40"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-between items-center">
              <div className="text-xs text-gray-400">
                Process Start
              </div>
              <div className="flex items-center gap-1.5">
                <div className="text-xs bg-[#1e2229] px-2 py-1 rounded-md border border-neutral-800 text-gray-400">
                  Last update: {delivery.date && `${delivery.date}`} 
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Completed
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DeliveryStatus;