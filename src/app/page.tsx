import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div>
      <Button size="lg">primary</Button>
      <Button size="lg" variant="muted">muted</Button>
      <Button size="lg" variant="teritary">teritary</Button>
      <Input type="text" />
    </div>
  );
}
