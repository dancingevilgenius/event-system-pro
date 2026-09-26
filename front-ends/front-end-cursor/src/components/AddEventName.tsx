import AppTextField from './AppTextField';

export const MIN_EVENT_NAME_LENGTH = 5;

export function eventNameCanBeFinalized(name: string): boolean {
  return name.trim().length >= MIN_EVENT_NAME_LENGTH;
}

type AddEventNameProps = {
  name: string;
  onNameChange: (name: string) => void;
  onFieldEdit?: () => void;
};

export default function AddEventName({
  name,
  onNameChange,
  onFieldEdit,
}: AddEventNameProps) {
  return (
    <AppTextField
      label="Event Name"
      value={name}
      onChange={(event) => {
        onNameChange(event.target.value);
        onFieldEdit?.();
      }}
      fullWidth
    />
  );
}
