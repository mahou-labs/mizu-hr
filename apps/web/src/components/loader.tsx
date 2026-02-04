import { IconSpinnerLoaderOutline24 } from "nucleo-core-outline-24";

export default function Loader() {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <IconSpinnerLoaderOutline24 className="animate-spin text-muted-foreground" />
    </div>
  );
}
