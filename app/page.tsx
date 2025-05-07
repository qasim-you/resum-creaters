 import { ResumeBuilder } from "@/components/resume-builder"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-start rotate-4 text-indigo-950">RESUMATE</h1>
      <ResumeBuilder />
    </main>
  )
}
