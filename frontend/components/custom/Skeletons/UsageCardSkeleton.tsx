import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";

interface UsageCardSkeletonProps {
  loading?: boolean;
}

const UsageCardSkeleton = ({ loading = true }: UsageCardSkeletonProps) => {
  if (!loading) return null;

  return (
    <Field className="w-full max-w-sm animate-pulse">
      <FieldLabel
        htmlFor="progress-upload"
        className="flex justify-between items-center"
      >
        <Skeleton className="h-4 w-24 rounded-md" />{" "}
        <Skeleton className="h-4 w-12 rounded-md" />
      </FieldLabel>

      <div className="mt-2 h-4 w-full rounded-md bg-muted">
        <Skeleton className="h-4 w-full rounded-md" />
      </div>
    </Field>
  );
};

export default UsageCardSkeleton;
