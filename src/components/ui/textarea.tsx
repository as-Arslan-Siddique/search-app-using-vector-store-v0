import * as React from "react";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export interface TextareaWithButtonProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextareaWithButton = React.forwardRef<
  HTMLTextAreaElement,
  TextareaWithButtonProps
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "relative flex items-center w-full rounded-[2rem] border border-input pl-3 bg-transparent py-2 shadow-sm focus-within:ring-1 focus-within:ring-ring",
        className
      )}
    >
      {/* Textarea */}
      <textarea
        className="flex-grow min-h-[28px] rounded-[2rem] bg-transparent px-3 py-2 text-sm focus:outline-none placeholder:text-muted-foreground resize-none"
        ref={ref}
        {...props}
      />

      {/* Send Button inside the border */}
      <Button
        type="submit" // Submit type to trigger form submission
        size={"icon"}
        variant={"default"}
        className="absolute right-2.5 bottom-2.5 h-8 w-8 p-1 rounded-full"
      >
        <SearchIcon className="h-5 w-5" />
      </Button>
    </div>
  );
});
TextareaWithButton.displayName = "TextareaWithButton";

export { TextareaWithButton, Textarea };
