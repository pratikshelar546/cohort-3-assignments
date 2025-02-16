import { Button } from '@repo/ui/button';
import {
  Pencil,
  Share2,
  Cloud,
  Users,
  Shapes,
  Palette,
  // ChevronRight,
  // Github
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header/Navigation */}
      <nav className="fixed w-full bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shapes className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">Excalidraw Clone</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Docs</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Blog</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition">
                Open Board
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
              Collaborate and Create
              <span className="text-blue-500"> Beautiful Diagrams</span>
            </h1>
            <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
              A virtual whiteboard for sketching hand-drawn like diagrams, with easy sharing and real-time collaboration capabilities.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/signin">
                <Button variant={'outline'} size={'lg'}>
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant={'secondary'} size={'lg'}>Sign Up</Button>
              </Link>
            </div>
          </div>
          <div className="mt-16 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            {/* <img
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=2000&q=80"
              alt="Collaborative drawing interface"
              className="w-full object-cover"
            /> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Powerful Features</h2>
            <p className="mt-4 text-gray-400">Everything you need to create and share your ideas</p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Pencil className="h-8 w-8 text-blue-500" />,
                title: "Intuitive Drawing",
                description: "Natural hand-drawn feel with smooth lines and shapes"
              },
              {
                icon: <Share2 className="h-8 w-8 text-blue-500" />,
                title: "Easy Sharing",
                description: "Share your drawings with a simple link"
              },
              {
                icon: <Cloud className="h-8 w-8 text-blue-500" />,
                title: "Cloud Sync",
                description: "Your drawings are automatically saved and synced"
              },
              {
                icon: <Users className="h-8 w-8 text-blue-500" />,
                title: "Real-time Collaboration",
                description: "Work together with your team in real-time"
              },
              {
                icon: <Shapes className="h-8 w-8 text-blue-500" />,
                title: "Rich Libraries",
                description: "Access a wide variety of shapes and templates"
              },
              {
                icon: <Palette className="h-8 w-8 text-blue-500" />,
                title: "Customization",
                description: "Personalize colors, styles, and more"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition border border-gray-800">
                <div className="bg-gray-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-16 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to start drawing?</h2>
            <p className="mt-4 text-blue-100 text-lg">
              Join thousands of users who are already creating amazing diagrams
            </p>
            <button className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition">
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Templates</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Press</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p>© 2025 Excalidraw Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
