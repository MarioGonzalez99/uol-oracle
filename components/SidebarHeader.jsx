import { FaBookJournalWhills } from "react-icons/fa6";
import ThemeToggle from './ThemeToggle';

const SidebarHeader = () => {
	return (
		<div className="flex items-center mb-4 gap-4 px-4">
			<FaBookJournalWhills className="w-10 h-10 text-primary" />
			<h2 className='text-lg font-extrabold text-primary'>UoL Oracle</h2>
			<ThemeToggle />
		</div>
	);
};

export default SidebarHeader;
