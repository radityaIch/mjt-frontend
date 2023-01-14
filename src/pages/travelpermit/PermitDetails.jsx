import { Link, useParams } from "react-router-dom";
import TravelForm from "./TravelForm";

const PermitDetails = () => {
  const { id } = useParams();

  return (
    <>
      <div className="btn-group mb-1">
        <Link to="#" className="btn btn-secondary fw-light active">
          Detail Surat Jalan
        </Link>
        <Link
          to={`/dashboard/surat-jalan/${id}/update-perjalanan`}
          className="btn bg-white fw-light"
        >
          Update Perjalanan (belum selesai)
        </Link>
      </div>
      <TravelForm isEdit />
    </>
  );
};

export default PermitDetails;
