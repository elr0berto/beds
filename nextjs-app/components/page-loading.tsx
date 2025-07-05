import { Loader2 } from "lucide-react";

export function PageLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="font-bold">Beds</div>
            <div className="flex items-center gap-4">
              {/* Placeholder navigation items */}
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-7xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}