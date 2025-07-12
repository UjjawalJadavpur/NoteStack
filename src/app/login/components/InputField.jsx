import { FaUser, FaEnvelope } from "react-icons/fa";

const iconMap = {
  name: FaUser,
  email: FaEnvelope,
};

export default function InputField({ name, ...props }) {
  const Icon = iconMap[name];

  return (
    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-400">
      {Icon && <Icon className="text-gray-400 mr-2" />}
      <input
        name={name}
        className="w-full bg-transparent outline-none text-sm"
        {...props}
      />
    </div>
  );
}
