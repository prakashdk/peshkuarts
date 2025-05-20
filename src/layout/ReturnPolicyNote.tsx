import { TbTruckReturn } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const ReturnPolicyNote = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 p-3 rounded cursor-pointer border border-gray-200"
      onClick={() => navigate("/return-policy")}
    >
      <TbTruckReturn className="text-indigo-500 text-lg" />
      <span>
        Easy 7-day return policy.{" "}
        <span className="underline text-indigo-600">Learn more</span>
      </span>
    </div>
  );
};

export default ReturnPolicyNote;
