import { Skeleton } from "@/components/ui/skeleton";

export function ProductSectionSkeleton() {
  return (
    <section>
      <Skeleton className="mb-6 h-8 w-52" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-xl bg-card p-4">
            <Skeleton className="mb-3 aspect-square w-full rounded-lg" />
            <Skeleton className="mb-2 h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}
