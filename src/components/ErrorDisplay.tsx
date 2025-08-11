import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Props for the ErrorDisplay component.
 */
interface ErrorDisplayProps {
  /** Title displayed above the error message */
  title?: string;
  /** The error message to display */
  message: string;
  /** Whether to show a back button */
  showBackButton?: boolean;
  /** URL for the back button (defaults to "/") */
  backHref?: string;
  /** Text for the back button */
  backText?: string;
  /** Additional CSS classes for styling */
  className?: string;
}

/**
 * ErrorDisplay component for showing error states with optional navigation.
 *
 * This component provides a consistent way to display errors across the application.
 * It can be used for both full-page error states and inline error messages.
 *
 * @param props - Component props
 * @returns JSX element
 *
 * @example
 * ```tsx
 * // Full page error
 * <ErrorDisplay
 *   title="Page Not Found"
 *   message="The page you're looking for doesn't exist."
 *   showBackButton={true}
 *   backHref="/"
 *   backText="Go Home"
 * />
 *
 * // Inline error
 * <ErrorDisplay
 *   title="Error"
 *   message="Failed to load data"
 *   className="my-4"
 * />
 * ```
 */
export default function ErrorDisplay({
  title = "Error",
  message,
  showBackButton = false,
  backHref = "/",
  backText = "Go Back",
  className = "",
}: ErrorDisplayProps) {
  return (
    <div className={`text-center ${className}`}>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground mb-6">{message}</p>

      {showBackButton && (
        <Link href={backHref}>
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backText}
          </Button>
        </Link>
      )}
    </div>
  );
}

/**
 * Props for the ErrorAlert component.
 */
interface ErrorAlertProps {
  /** The error message to display */
  message: string;
}

/**
 * ErrorAlert component for displaying inline error messages.
 *
 * This component is designed for showing errors within forms or other content
 * without taking up the full page. It uses the Alert component from shadcn/ui
 * for consistent styling.
 *
 * @param props - Component props
 * @returns JSX element
 *
 * @example
 * ```tsx
 * <ErrorAlert message="Please fill in all required fields." />
 * ```
 */
export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
