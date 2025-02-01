import DoctorDashboard from "../components/DoctorDashboard/DoctorDashboard";
import PatientDashboard from "../components/PatientDashboard/PatientDashboard";

function Dashboard() {
  return (
    <div className="flex flex-col overflow-hidden p-4 font-noto md:py-8 md:px-12">
      {/* <PatientDashboard /> */}
      <DoctorDashboard />
    </div>
  );
}

export default Dashboard;
