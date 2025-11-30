import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-800">CodeSmart</h1>
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4 md:p-8">
        <h2 className="text-5xl font-extrabold md:text-6xl tracking-tight">
          Get Instant Feedback on Your Code
        </h2>
        <p className="mt-6 text-lg text-gray-600 md:text-xl max-w-3xl">
          CodeSmart uses AI to analyze your code and provide you with a
          detailed report on its quality, with a score, strengths, and areas for improvement. 
          Stop guessing, start improving.
        </p>
        <div className="mt-10">
          <Link to="/signup">
            <Button size="lg" className="text-lg py-3 px-8">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
      <footer className="p-4 border-t bg-white text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CodeSmart. All rights reserved.
      </footer>
    </div>
  );
}
