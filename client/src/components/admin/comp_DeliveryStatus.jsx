import React from 'react';
import { cn } from "@/lib/utils"

const statusOrder = ["Ordered", "Processing", "Shipped", "Out for Delivery", "Delivered"]

function DeliveryStatus({ deliveries }) {
  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {deliveries.map((delivery, index) => {
        const currentStepIndex = statusOrder.indexOf(delivery.status)
        return (
          <div key={index} className="relative">
            <div className="flex items-center justify-between">
              {statusOrder.map((step, stepIndex) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium",
                      stepIndex <= currentStepIndex
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background text-muted-foreground"
                    )}
                  >
                    {stepIndex === currentStepIndex && (
                      <span className="animate-pulse">{step.charAt(0)}</span>
                    )}
                  </div>
                  {stepIndex < statusOrder.length - 1 && (
                    <div
                      className={cn(
                        "w-full h-0.5 mt-3",
                        stepIndex < currentStepIndex ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Ordered</span>
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  delivery.status === "Delivered"
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {delivery.status} {delivery.date && `- ${delivery.date}`}
              </div>
              <span className="text-sm font-medium text-muted-foreground">Delivered</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DeliveryStatus;