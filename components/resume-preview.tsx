"use client"

import type { ResumeData } from "@/types/resume"

interface ResumePreviewProps {
  data: ResumeData
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const { personalInfo, achievements, workExperience, education, skills } = data

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 shadow-lg rounded-lg print:shadow-none print:p-0">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{personalInfo.name || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          {personalInfo.email && (
            <span className="flex items-center">
              <span className="mr-1">📧</span> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center">
              <span className="mr-1">📱</span> {personalInfo.phone}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center">
              <span className="mr-1">GitHub:</span> {personalInfo.github}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center">
              <span className="mr-1">LinkedIn:</span> {personalInfo.linkedin}
            </span>
          )}
        </div>
      </div>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 dark:border-gray-700 pb-1 mb-3">Achievements</h2>
          <ul className="list-disc pl-5 space-y-2">
            {achievements.map((achievement) => (
              <li key={achievement.id}>
                <div className="font-medium">{achievement.title}</div>
                {achievement.description && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Work Experience Section */}
      {workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 dark:border-gray-700 pb-1 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((experience) => (
              <div key={experience.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{experience.title}</h3>
                    <p className="text-sm">
                      {experience.company}
                      {experience.location && ` • ${experience.location}`}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {experience.startDate} - {experience.current ? "Present" : experience.endDate}
                  </p>
                </div>
                {experience.description && <p className="text-sm mt-1">{experience.description}</p>}
                {experience.responsibilities.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {experience.responsibilities.map((responsibility, index) => (
                      <li key={index} className="text-sm">
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 dark:border-gray-700 pb-1 mb-3">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-sm">
                      {edu.institution}
                      {edu.location && ` • ${edu.location}`}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
                {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 border-gray-300 dark:border-gray-700 pb-1 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                {skill.name}
                {skill.level && ` (${skill.level})`}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
