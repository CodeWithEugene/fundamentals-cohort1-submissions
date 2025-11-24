import { Link } from "react-router-dom"
import { Code2, Users, Zap } from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">Connect. Build. Collaborate.</h1>
          <p className="text-xl text-muted-foreground">
            DevConnect is where developers share ideas, find collaborators, and build amazing projects together.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/projects">
              <Button size="lg">Explore Projects</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why DevConnect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="space-y-4">
                <Code2 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Share Ideas</h3>
                <p className="text-muted-foreground">
                  Post your project ideas and get feedback from the developer community.
                </p>
              </div>
            </Card>
            <Card>
              <div className="space-y-4">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Find Collaborators</h3>
                <p className="text-muted-foreground">Connect with developers who share your interests and skills.</p>
              </div>
            </Card>
            <Card>
              <div className="space-y-4">
                <Zap className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Build Together</h3>
                <p className="text-muted-foreground">Collaborate on projects and create something amazing.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground">Join thousands of developers building the future.</p>
          <Link to="/register">
            <Button size="lg">Create Your Account</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
