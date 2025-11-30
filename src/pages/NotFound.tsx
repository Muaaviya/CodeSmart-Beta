import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-600">Page Not Found</p>
        <p className="mt-4 text-gray-500">
          The page you are looking for does not exist.
        </p>
        <Link to="/">
          <button className="mt-8 px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Go to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}
