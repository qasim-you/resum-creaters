import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import type { ResumeData } from "@/types/resume"

export async function generatePDF(resumeData: ResumeData): Promise<void> {
  // Create a temporary div to render the resume
  const tempDiv = document.createElement("div")
  tempDiv.style.position = "absolute"
  tempDiv.style.left = "-9999px"
  tempDiv.style.top = "-9999px"
  tempDiv.style.width = "800px" // Fixed width for PDF

  // Add the temp div to the body
  document.body.appendChild(tempDiv)

  // Create the resume HTML
  tempDiv.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 40px; color: #000; background: #fff;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; margin-bottom: 10px;">${resumeData.personalInfo.name || "Your Name"}</h1>
        <div style="font-size: 12px;">
          ${resumeData.personalInfo.email ? `📧 ${resumeData.personalInfo.email} ` : ""}
          ${resumeData.personalInfo.phone ? `📱 ${resumeData.personalInfo.phone} ` : ""}
          ${resumeData.personalInfo.github ? `GitHub: ${resumeData.personalInfo.github} ` : ""}
          ${resumeData.personalInfo.linkedin ? `LinkedIn: ${resumeData.personalInfo.linkedin}` : ""}
        </div>
      </div>

      <!-- Achievements Section -->
      ${
        resumeData.achievements.length > 0
          ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">
            Achievements
          </h2>
          <ul style="padding-left: 20px; margin-top: 10px;">
            ${resumeData.achievements
              .map(
                (achievement) => `
              <li style="margin-bottom: 8px;">
                <div style="font-weight: bold;">${achievement.title}</div>
                ${achievement.description ? `<div style="font-size: 12px;">${achievement.description}</div>` : ""}
              </li>
            `,
              )
              .join("")}
          </ul>
        </div>
      `
          : ""
      }

      <!-- Work Experience Section -->
      ${
        resumeData.workExperience.length > 0
          ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">
            Work Experience
          </h2>
          <div>
            ${resumeData.workExperience
              .map(
                (experience) => `
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <div>
                    <div style="font-weight: bold;">${experience.title}</div>
                    <div style="font-size: 12px;">
                      ${experience.company}
                      ${experience.location ? ` • ${experience.location}` : ""}
                    </div>
                  </div>
                  <div style="font-size: 12px; color: #666;">
                    ${experience.startDate} - ${experience.current ? "Present" : experience.endDate}
                  </div>
                </div>
                ${experience.description ? `<div style="font-size: 12px; margin-bottom: 5px;">${experience.description}</div>` : ""}
                ${
                  experience.responsibilities.length > 0
                    ? `
                  <ul style="padding-left: 20px; margin-top: 5px;">
                    ${experience.responsibilities
                      .map(
                        (responsibility) => `
                      <li style="font-size: 12px;">${responsibility}</li>
                    `,
                      )
                      .join("")}
                  </ul>
                `
                    : ""
                }
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }

      <!-- Education Section -->
      ${
        resumeData.education.length > 0
          ? `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">
            Education
          </h2>
          <div>
            ${resumeData.education
              .map(
                (edu) => `
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <div>
                    <div style="font-weight: bold;">${edu.degree}</div>
                    <div style="font-size: 12px;">
                      ${edu.institution}
                      ${edu.location ? ` • ${edu.location}` : ""}
                    </div>
                  </div>
                  <div style="font-size: 12px; color: #666;">
                    ${edu.startDate} - ${edu.endDate}
                  </div>
                </div>
                ${edu.description ? `<div style="font-size: 12px;">${edu.description}</div>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }

      <!-- Skills Section -->
      ${
        resumeData.skills.length > 0
          ? `
        <div>
          <h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">
            Skills
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${resumeData.skills
              .map(
                (skill) => `
              <span style="background-color: #f0f0f0; padding: 4px 10px; border-radius: 15px; font-size: 12px;">
                ${skill.name}${skill.level ? ` (${skill.level})` : ""}
              </span>
            `,
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }
    </div>
  `

  try {
    // Convert the HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
    })

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Add the canvas as an image to the PDF
    const imgData = canvas.toDataURL("image/png")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0

    pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)

    // Save the PDF
    pdf.save(`${resumeData.personalInfo.name || "resume"}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("Failed to generate PDF. Please try again.")
  } finally {
    // Clean up
    document.body.removeChild(tempDiv)
  }
}
