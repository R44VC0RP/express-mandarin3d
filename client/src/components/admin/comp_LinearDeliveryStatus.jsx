import React from 'react';
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

function DeliveryStatus({ deliveries, statusOrder=["Designing", "In Queue", "Printing", "Shipped", "Delivered"] }) {
  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto">
      {deliveries.map((delivery, index) => {
        const currentStepIndex = statusOrder.indexOf(delivery.status)
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
                      <div
                        className={cn(
                          "absolute top-1/2 transform -translate-y-1/2",
                          stepIndex === 0 ? "left-0" : stepIndex === statusOrder.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2",
                          "h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium px-4 z-10 whitespace-nowrap",
                          "border-primary bg-primary text-primary-foreground"
                        )}
                      >
                        {step}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center z-10",
                          stepIndex < currentStepIndex
                            ? "border-primary bg-primary"
                            : "border-muted bg-background"
                        )}
                      />
                    )}
                  </div>
                  {stepIndex < statusOrder.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 w-full",
                        stepIndex < currentStepIndex ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">{statusOrder[0]}</span>
              <div className="text-sm font-medium text-primary">
                <Badge variant="secondary" className="bg-green-100 text-green-600">
                  Last update: {delivery.date && `${delivery.date}`} 
                </Badge>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{statusOrder[statusOrder.length - 1]}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DeliveryStatus;