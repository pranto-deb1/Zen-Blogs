import { WanderingEyes } from "@/_components/wandering-eyes";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <WanderingEyes className="h-20 w-45 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
  );
}
