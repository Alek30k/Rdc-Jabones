export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        🚧 Sitio en mantenimiento
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Estamos realizando mejoras para ofrecerte una mejor experiencia. Por
        favor, vuelve a intentarlo más tarde.
      </p>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
    </div>
  );
}
