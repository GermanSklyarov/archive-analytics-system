import { Button, useDataProvider, useNotify, useRefresh } from "react-admin";
import UploadIcon from "@mui/icons-material/Upload";

export const ImportButton = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await dataProvider.importFile(file);

      notify("Файл загружен", { type: "success" });
      refresh();
    } catch {
      notify("Ошибка загрузки", { type: "error" });
    }
  };

  return (
    <Button label="Import Excel" component="label">
      <input
        type="file"
        hidden
        accept=".xlsx,.xls,.csv"
        onChange={handleUpload}
      />
      <UploadIcon />
    </Button>
  );
};
