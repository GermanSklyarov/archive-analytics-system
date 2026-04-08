import UploadIcon from "@mui/icons-material/Upload";
import { Button } from "react-admin";
import { useNavigate } from "react-router-dom";

export const ImportButton = () => {
  const navigate = useNavigate();

  return (
    <Button label="Import Excel" onClick={() => navigate("/archive/import")}>
      <UploadIcon />
    </Button>
  );
};
