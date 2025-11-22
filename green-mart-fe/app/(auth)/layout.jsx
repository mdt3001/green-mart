export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      {children}
    </div>
  );
}
