import CandidateForm from "@/components/CandidateForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Candidate Application System
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-4">
              Submit your application and let our AI-powered system match you
              with the perfect role
            </p>
          </div>

          <CandidateForm />
        </div>
      </div>
    </div>
  );
}
