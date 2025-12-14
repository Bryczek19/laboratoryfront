import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-gray-600">Page not found</p>

      <Link
        href="/"
        className="px-4 py-2 border bg-gray-900 text-white"
      >
        Go to home
      </Link>
    </div>
  );
}
