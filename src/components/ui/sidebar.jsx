import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={{
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            }}
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={{
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            }}
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-[60px] items-center px-6", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-[60px] items-center px-6", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "mb-2 px-2 text-lg font-semibold tracking-tight",
      className
    )}
    {...props}
  />
))
SidebarTitle.displayName = "SidebarTitle"

const SidebarDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mb-4 px-2 text-sm text-muted-foreground", className)}
    {...props}
  />
))
SidebarDescription.displayName = "SidebarDescription"

const SidebarSection = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-4 p-4", className)}
    {...props}
  />
))
SidebarSection.displayName = "SidebarSection"

const SidebarHeading = React.forwardRef(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("mb-2 px-2 text-sm font-semibold", className)}
    {...props}
  />
))
SidebarHeading.displayName = "SidebarHeading"

const SidebarScrollArea = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto", className)}
    {...props}
  />
))
SidebarScrollArea.displayName = "SidebarScrollArea"

const SidebarToggle = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn("mr-2 px-0 hover:bg-transparent", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarToggle.displayName = "SidebarToggle"

const SidebarCollapsible = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-auto",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsible.displayName = "SidebarCollapsible"

const SidebarCollapsibleContent = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-auto",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleContent.displayName = "SidebarCollapsibleContent"

const SidebarCollapsibleFooter = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-auto",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleFooter.displayName = "SidebarCollapsibleFooter"

const SidebarCollapsibleHeader = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-auto",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleHeader.displayName = "SidebarCollapsibleHeader"

const SidebarCollapsibleTitle = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <h2
      ref={ref}
      className={cn(
        "mb-2 px-2 text-lg font-semibold tracking-tight",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleTitle.displayName = "SidebarCollapsibleTitle"

const SidebarCollapsibleDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <p
      ref={ref}
      className={cn(
        "mb-4 px-2 text-sm text-muted-foreground",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleDescription.displayName = "SidebarCollapsibleDescription"

const SidebarCollapsibleSection = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-4 p-4",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleSection.displayName = "SidebarCollapsibleSection"

const SidebarCollapsibleHeading = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <h4
      ref={ref}
      className={cn(
        "mb-2 px-2 text-sm font-semibold",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleHeading.displayName = "SidebarCollapsibleHeading"

const SidebarCollapsibleScrollArea = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-auto",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleScrollArea.displayName = "SidebarCollapsibleScrollArea"

const SidebarCollapsibleToggle = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn("mr-2 px-0 hover:bg-transparent", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarCollapsibleToggle.displayName = "SidebarCollapsibleToggle"

const SidebarCollapsibleItem = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-auto",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleItem.displayName = "SidebarCollapsibleItem"

const SidebarCollapsibleItemContent = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-auto",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleItemContent.displayName = "SidebarCollapsibleItemContent"

const SidebarCollapsibleItemFooter = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-auto",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleItemFooter.displayName = "SidebarCollapsibleItemFooter"

const SidebarCollapsibleItemHeader = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-auto",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleItemHeader.displayName = "SidebarCollapsibleItemHeader"

const SidebarCollapsibleItemTitle = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <h2
      ref={ref}
      className={cn(
        "mb-2 px-2 text-lg font-semibold tracking-tight",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleItemTitle.displayName = "SidebarCollapsibleItemTitle"

const SidebarCollapsibleItemDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <p
      ref={ref}
      className={cn(
        "mb-4 px-2 text-sm text-muted-foreground",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleItemDescription.displayName = "SidebarCollapsibleItemDescription"

const SidebarCollapsibleItemSection = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-4 p-4",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleItemSection.displayName = "SidebarCollapsibleItemSection"

const SidebarCollapsibleItemHeading = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <h4
      ref={ref}
      className={cn(
        "mb-2 px-2 text-sm font-semibold",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleItemHeading.displayName = "SidebarCollapsibleItemHeading"

const SidebarCollapsibleItemScrollArea = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-auto",
        state === "collapsed" && "hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarCollapsibleItemScrollArea.displayName = "SidebarCollapsibleItemScrollArea"

const SidebarCollapsibleItemToggle = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn("mr-2 px-0 hover:bg-transparent", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarCollapsibleItemToggle.displayName = "SidebarCollapsibleItemToggle"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTitle,
  SidebarDescription,
  SidebarSection,
  SidebarHeading,
  SidebarScrollArea,
  SidebarToggle,
  SidebarCollapsible,
  SidebarCollapsibleContent,
  SidebarCollapsibleFooter,
  SidebarCollapsibleHeader,
  SidebarCollapsibleTitle,
  SidebarCollapsibleDescription,
  SidebarCollapsibleSection,
  SidebarCollapsibleHeading,
  SidebarCollapsibleScrollArea,
  SidebarCollapsibleToggle,
  SidebarCollapsibleItem,
  SidebarCollapsibleItemContent,
  SidebarCollapsibleItemFooter,
  SidebarCollapsibleItemHeader,
  SidebarCollapsibleItemTitle,
  SidebarCollapsibleItemDescription,
  SidebarCollapsibleItemSection,
  SidebarCollapsibleItemHeading,
  SidebarCollapsibleItemScrollArea,
  SidebarCollapsibleItemToggle,
} 