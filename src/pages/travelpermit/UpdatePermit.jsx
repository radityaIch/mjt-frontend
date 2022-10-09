import { Link, useParams } from "react-router-dom";
import TrackingForm from "./TrackingForm";

const UpdatePermit = () => {
  const { id } = useParams();

  return (
    <>
      <div className="btn-group mb-1">
        <Link to={`/dashboard/surat-jalan/${id}`} className="btn bg-white fw-light">
          Detail Surat Jalan
        </Link>
        <Link
          to="#"
          className="btn btn-secondary fw-light active"
        >
          Update Perjalanan
        </Link>
      </div>
      <TrackingForm />
    </>
  );
};

export default UpdatePermit;
