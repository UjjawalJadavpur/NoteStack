import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";


export default function PasswordField({
  show,
  toggle,
  value,
  onChange,
  onEnter,
}) {
  return (
    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-400">
      <FaLock className="text-gray-400 mr-2" />
      <input
        type={show ? "text" : "password"}
        name="password"
        placeholder="Password"
        className="w-full bg-transparent outline-none text-sm"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
      />
      {show ? (
        <FaEyeSlash
          onClick={toggle}
          className="text-gray-400 ml-2 cursor-pointer hover:text-gray-600"
        />
      ) : (
        <FaEye
          onClick={toggle}
          className="text-gray-400 ml-2 cursor-pointer hover:text-gray-600"
        />
      )}
    </div>
  );
}
