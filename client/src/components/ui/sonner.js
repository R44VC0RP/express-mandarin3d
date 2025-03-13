import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = (props) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      visibleToasts={10}
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      style={{
        "--success-bg": "#064346",
        "--success-border": "#466F80",
        "--success-text": "#11B3BD",
      }}
      {...props}
    />
  )
}

export { Toaster }
