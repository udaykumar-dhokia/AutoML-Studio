import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const UsageCard = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const total = user?.totalLimit ?? 0;
  const current = user?.currentLimit ?? 0;

  const usage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="progress-upload">
        <span>Execution remaining</span>
        <span className="ml-auto">
          {current}/{total}
        </span>
      </FieldLabel>
      <Progress value={usage} id="progress-upload" />
    </Field>
  );
};

export default UsageCard;
