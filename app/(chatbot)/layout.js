import Sidebar from "@/components/Sidebar";
import { HiMiniBars3 } from "react-icons/hi2";

const layout = ({ children }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input type="checkbox" id="drawer-toggle" name="drawer-toggle" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="bg-base-200 px-8 py-12 min-h-screen">
          <label htmlFor="drawer-toggle" className="drawer-button lg:hidden fixed top-6 right-6">
            <HiMiniBars3 className="w-8 h-8 text-primary" />
          </label>
          {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer-toggle" aria-label="close sidebar" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
}

export default layout;
